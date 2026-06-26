from pydantic import BaseModel, Field
from typing import Annotated, Optional, List, Dict
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.Database.connection import Connection


app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class customer_data(BaseModel):
    customer_name: Annotated[
        Optional[str],
        Field(
            default=None,
            description="Name of Customer",
            examples=["Ali"]
        )
    ]

    phone_no: Annotated[
        Optional[str],
        Field(
            default=None,
            description="Phone Number of Customer",
            examples=["03214432343"]
        )
    ]

    invoice_date: Annotated[
        str,
        Field(
            description="Date when the invoice was made",
            examples=["2026-06-21"]
        )
    ]


class invoice_item(BaseModel):
    id: Annotated[
        Optional[str],
        Field(description="Product ID", examples=[1])
    ]

    qr_code: Annotated[
        Optional[str],
        Field(default=None, description="Product QR Code", examples=["123456789"])
    ]

    product_name: Annotated[
        str,
        Field(description="Product Name", examples=["Pepsi"])
    ]

    price: Annotated[
        float,
        Field(description="Unit Price", examples=[120.0])
    ]

    quantity: Annotated[
        float,
        Field(description="Quantity Purchased", examples=[2])
    ]

    discount: Annotated[
        float,
        Field(description="Discount Percentage", examples=[5.0])
    ]

    gst: Annotated[
        float,
        Field(description="GST Percentage", examples=[18.0])
    ]

    subtotal: Annotated[
        str,
        Field(description="Subtotal Amount", examples=["240.00"])
    ]

    gst_amount: Annotated[
        str,
        Field(description="GST Amount", examples=["43.20"])
    ]

    discount_amount: Annotated[
        str,
        Field(description="Discount Amount", examples=["12.00"])
    ]

    total: Annotated[
        str,
        Field(description="Final Item Total", examples=["271.20"])
    ]


class invoice_data(BaseModel):
    invoice_number: Annotated[
        str,
        Field(description="Invoice Number", examples=["INV-1750755000"])
    ]

    created_at: Annotated[
        str,
        Field(description="Invoice Creation Timestamp")
    ]

    customer: customer_data

    payment_method: Annotated[
        str,
        Field(description="Payment Method", examples=["Cash"])
    ]

    items: List[invoice_item]

    totals: Dict[str, float]


def product_exists_in_inventory(cursor, qr_code):

    if qr_code is None:
        return False

    cleaned_code = str(qr_code).strip()

    if cleaned_code == "":
        return False

    cursor.execute("""
        SELECT qr_code
        FROM inventory
        WHERE LOWER(TRIM(qr_code)) = LOWER(TRIM(%s))
    """, (cleaned_code,))

    row = cursor.fetchone()

    if row:
        return True

    return False


@app.get("/inventory/search")
def search_inventory_products(query: str = ""):

    conn = None
    cursor = None

    try:

        search_text = query.strip()

        if search_text == "":
            return {
                "success": True,
                "results": []
            }

        conn = Connection()
        cursor = conn.cursor()

        search_value = "%" + search_text.lower() + "%"

        cursor.execute("""
            SELECT
                qr_code,
                product_name,
                selling_price,
                discount,
                gst,
                quantity,
                unit_type
            FROM inventory
            WHERE LOWER(product_name) LIKE %s
               OR LOWER(qr_code) LIKE %s
            ORDER BY product_name
            LIMIT 10
        """, (search_value, search_value))

        rows = cursor.fetchall()
        results = []

        for row in rows:
            results.append({
                "qr_code": row[0],
                "product_name": row[1],
                "selling_price": float(row[2]) if row[2] is not None else 0,
                "discount": float(row[3]) if row[3] is not None else 0,
                "gst": float(row[4]) if row[4] is not None else 0,
                "quantity": float(row[5]) if row[5] is not None else 0,
                "unit_type": row[6]
            })

        return {
            "success": True,
            "results": results
        }

    except Exception as e:

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e)
            }
        )

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.get("/inventory/{qr_code}")
def get_inventory_item(qr_code: str):

    conn = None
    cursor = None

    try:

        conn = Connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                qr_code,
                product_name,
                selling_price,
                discount,
                gst,
                quantity,
                unit_type
            FROM inventory
            WHERE LOWER(TRIM(qr_code)) = LOWER(TRIM(%s))
        """, (qr_code,))

        row = cursor.fetchone()

        if not row:
            return JSONResponse(
                status_code=404,
                content={
                    "success": False,
                    "message": "Product not found"
                }
            )

        return {
            "success": True,
            "qr_code": row[0],
            "product_name": row[1],
            "selling_price": float(row[2]) if row[2] is not None else 0,
            "discount": float(row[3]) if row[3] is not None else 0,
            "gst": float(row[4]) if row[4] is not None else 0,
            "quantity": float(row[5]) if row[5] is not None else 0,
            "unit_type": row[6]
        }

    except Exception as e:

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e)
            }
        )

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.post('/invoice')
def invoice_data_saved(invoice: invoice_data):

    conn = None
    cursor = None

    try:

        conn = Connection()
        cursor = conn.cursor()

        # Save Invoice Header
        cursor.execute("""
            INSERT INTO invoices (
                invoice_number,
                created_at,
                customer_name,
                phone_no,
                invoice_date,
                payment_method,
                subtotal,
                gst_total,
                discount_total,
                grand_total
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            invoice.invoice_number,
            invoice.created_at,
            invoice.customer.customer_name,
            invoice.customer.phone_no,
            invoice.customer.invoice_date,
            invoice.payment_method,
            invoice.totals.get("subtotal", 0),
            invoice.totals.get("gst", 0),
            invoice.totals.get("discount", 0),
            invoice.totals.get("total", 0)
        ))

        # Save Invoice Items
        for item in invoice.items:

            cursor.execute("""
                INSERT INTO invoice_items (
                    invoice_number,
                    qr_code,
                    product_name,
                    price,
                    quantity,
                    discount,
                    gst,
                    subtotal,
                    gst_amount,
                    discount_amount,
                    total
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """, (
                invoice.invoice_number,
                item.qr_code,
                item.product_name,
                item.price,
                item.quantity,
                item.discount,
                item.gst,
                item.subtotal,
                item.gst_amount,
                item.discount_amount,
                item.total
            ))

            if product_exists_in_inventory(cursor, item.qr_code):

                # Product exists in inventory, reduce stock. Negative stock is allowed.
                cursor.execute("""
                    UPDATE inventory
                    SET quantity = quantity - %s
                    WHERE LOWER(TRIM(qr_code)) = LOWER(TRIM(%s))
                """, (
                    item.quantity,
                    item.qr_code
                ))

            else:

                # Product not in inventory, save in separate manual sales table.
                cursor.execute("""
                    INSERT INTO manual_invoice_items (
                        invoice_number,
                        qr_code,
                        product_name,
                        price,
                        quantity,
                        discount,
                        gst,
                        subtotal,
                        gst_amount,
                        discount_amount,
                        total
                    )
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                """, (
                    invoice.invoice_number,
                    item.qr_code,
                    item.product_name,
                    item.price,
                    item.quantity,
                    item.discount,
                    item.gst,
                    item.subtotal,
                    item.gst_amount,
                    item.discount_amount,
                    item.total
                ))

        conn.commit()

        return {
            "success": True,
            "message": "Invoice Successfully Saved",
            "invoice_number": invoice.invoice_number
        }

    except Exception as e:

        if conn:
            conn.rollback()

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e)
            }
        )

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()