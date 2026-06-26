def insert_in_purchase_history():
    return("""
            INSERT INTO purchase_history(
            supplier_name,
            purchase_date,
            qr_code,
            product_name,
            quantity,
            unit_type,
            min_stock,
            buying_price,
            selling_price,
            gst,
            discount)
            VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """)


def check_if_data_of_same_qr_is_present():
    return("""SELECT EXISTS(
        SELECT 1
        FROM inventory
        WHERE qr_code = %s
        )""")

def update_in_existing_inventory():
    return( """
                UPDATE inventory
                SET
                    product_name = %s,

                    avg_buying_price =
                    (
                        (avg_buying_price * quantity)
                        +
                        (%s * %s)
                    )
                    /
                    (quantity + %s),

                    quantity = quantity + %s,

                    unit_type = %s,

                    min_stock = %s,

                    selling_price = %s,
                    gst = %s,
                    discount = %s,

                    updated_at = CURRENT_TIMESTAMP

                WHERE qr_code = %s""")


def update_inventory_if_item_is_new():
    return( """
                UPDATE inventory
                SET
                    product_name = %s,

                    avg_buying_price =
                    (
                        (avg_buying_price * quantity)
                        +
                        (%s * %s)
                    )
                    /
                    (quantity + %s),

                    quantity = quantity + %s,

                    unit_type = %s,

                    min_stock = %s,

                    selling_price = %s,
                    gst = %s,
                    discount = %s,

                    updated_at = CURRENT_TIMESTAMP

                WHERE qr_code = %s""")

def auto_complete():
    return("""
        SELECT
            qr_code,
            product_name,
            selling_price,
            gst,
            discount,
            min_stock
        FROM inventory
        WHERE qr_code = %s
    """)