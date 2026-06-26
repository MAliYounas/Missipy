from pydantic import BaseModel, Field
from typing import Annotated,Optional

class Product(BaseModel):

    supplier_name: Annotated[
        Optional[str],
        Field(
            default=None,
            description="Name of the supplier providing the product",
            examples=["ABC Traders"]
        )
    ]

    purchase_date: Annotated[
        str,
        Field(
            description="Date when the product purchase was made",
            examples=["2026-06-21"]
        )
    ]

    qr_code: Annotated[
        Optional[str],
        Field(
            default=None,
            description="QR code or barcode of the product",
            examples=["123456789"]
        )
    ]

    product_name: Annotated[
        Optional[str],
        Field(
            default=None,
            description="Name of the product",
            examples=["Wireless Mouse"]
        )
    ]


    quantity: Annotated[
        int,
        Field(
            ge=0,
            description="Quantity of the product purchased",
            examples=[10]
        )
    ]


    unit_type: Annotated[
        Optional[str],
        Field(
            default=None,
            description="Unit type of the product",
            examples=["pcs"]
        )
    ]


    min_stock: Annotated[
        int,
        Field(
            ge=0,
            description="Minimum stock level for product warning",
            examples=[5]
        )
    ]


    buying_price: Annotated[
        float,
        Field(
            ge=0,
            description="Purchase price of one unit",
            examples=[500]
        )
    ]


    selling_price: Annotated[
        float,
        Field(
            ge=0,
            description="Selling price of one unit",
            examples=[800]
        )
    ]


    gst: Annotated[
        Optional[float],
        Field(
            default=None,
            ge=0,
            le=100,
            description="GST percentage applied on product",
            examples=[18]
        )
    ]


    discount: Annotated[
        Optional[float],
        Field(
            default=None,
            ge=0,
            le=100,
            description="Discount percentage applied on product",
            examples=[5]
        )
    ]



class Inventory(BaseModel):
    items:list[Product]