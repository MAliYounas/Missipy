import psycopg2 


from configparser import ConfigParser


def load_config():
    parser=ConfigParser()
    parser.read(r"C:\Users\hp\OneDrive - Higher Education Commission\Pictures\Missipy\backend\Database\config.ini")
    config={}
    for key,value in parser.items('postgresql'):
        config[key]=value

    return config

def Connection():
    config=load_config()
    conn=psycopg2.connect(
        host=config['host'],
        database=config['database'],
        user=config['user'],
        password=config['password'],
        port=config['port']
    )

    return conn