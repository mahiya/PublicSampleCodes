# pip install google-cloud-datastore
from google.cloud import datastore

project_id = ''
kind_name = 'Sample'
ds = datastore.Client(project_id)

def list(limit=100):
    cursor = None
    while True:
        query = ds.query(kind=kind_name)
        query_iterator = query.fetch(limit=limit, start_cursor=cursor)
        entities = next(query_iterator.pages)                
        for entity in entities:
            print("id = {}".format(entity.key.id))
            for key in entity.keys():
                print("  {} = {}".format(key, entity[key]))
        if query_iterator.next_page_token == None: break
        cursor = query_iterator.next_page_token.decode('utf-8')

def put(data):
    key = ds.key(kind_name)
    entity = datastore.Entity(key=key)
    entity.update(data)
    ds.put(entity)

def delete(id):
    key = ds.key(kind_name, int(id))
    ds.delete(key)

for i in range(0, 100):
    data = { "prop1": 'abc' }
    put(data)
list()
