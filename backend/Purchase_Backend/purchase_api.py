from fastapi import FastAPI,HTTPException 
from backend.Purchase_Backend.schemas import Inventory
from fastapi.middleware.cors import CORSMiddleware
from backend.Database.connection import Connection
from backend.Purchase_Backend.query import insert_in_purchase_history ,check_if_data_of_same_qr_is_present ,update_in_existing_inventory,update_inventory_if_item_is_new,auto_complete

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.get('/')
def home():
    return {'message':'Api for Missipy purchase is working.'}


@app.post('/add_products')
def add_products(inventory:Inventory):
    conn=Connection()
    cursor=conn.cursor()

    


    

    for product in inventory.items:
        
        values = (
            product.supplier_name,
            product.purchase_date,
            product.qr_code,
            product.product_name,
            product.quantity,
            product.unit_type,
            product.min_stock,
            product.buying_price,
            product.selling_price,
            product.gst,
            product.discount)


        query = insert_in_purchase_history()



        cursor.execute(query,values)

        query= check_if_data_of_same_qr_is_present()
        qr_code_value=product.qr_code

        cursor.execute(query,(qr_code_value,))
        exists = cursor.fetchone()[0]

        if exists:


            update_values = (
                product.product_name,
                product.buying_price,
                product.quantity,
                product.quantity,

                product.quantity,

                product.unit_type,
                product.min_stock,

                product.selling_price,
                product.gst,
                product.discount,

                product.qr_code)


            update_query = update_in_existing_inventory()


            cursor.execute(update_query, update_values)



        else:


            inventory_values = (
            product.qr_code,
            product.product_name,
            product.unit_type,
            product.buying_price,
            product.selling_price,
            product.gst,
            product.discount,
            product.quantity,
            product.min_stock)


            inventory_query =update_inventory_if_item_is_new()


            cursor.execute(inventory_query, inventory_values)



    conn.commit()
    cursor.close()
    conn.close()
    return {
        "message":"saved",
    }
    

@app.get('/automaticCompletion')
def complete_fill_automatic_purchases(qr_code:str):
    result={}

    conn=Connection()

    cursor=conn.cursor()
    query = auto_complete()


    cursor.execute(query, (qr_code,))
    product=cursor.fetchone()

    if product is None:
        return {
            "found": False,
            "message": "Product not found"
        }

    return {
        "found": True,
        "qr_code": product[0],
        "product_name": product[1],
        "selling_price": float(product[2]) if product[2] is not None else None,
        "gst": float(product[3]) if product[3] is not None else None,
        "discount": float(product[4]) if product[4] is not None else None,
        "min_stock": product[5]
    }
    
    

    

