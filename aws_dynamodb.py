# pip install boto3
import boto3
from boto3.dynamodb.conditions import Key, Attr

# IAMアクセスID＆キーで認証する場合
access_key_id = ''
secret_access_key = ''

# リージョン名を指定
region = ''

# クライアントを作成
client = boto3.resource('dynamodb', 
    aws_access_key_id=access_key_id,
    aws_secret_access_key=secret_access_key,
    region_name=region)

# テーブルのクライアントを作成
table_name = 'TodoList'
table = client.Table(table_name)

# データを追加
userIds = ['user1', 'user2', 'user3']
for userId in userIds: 
    resp = table.put_item(
    Item = {
            'userId': userId,
            'userName': userId,
            'todoList': [
                {"todo": "{}'s completed task".format(userId), "isCompleted": True }, 
                {"todo": "{}'s uncompleted task".format(userId), "isCompleted": False }, 
            ]
        }
    )

# 全データを取得
allData = table.scan()
print("# allData = {}".format(allData))

# 特定のキーのデータを取得
key = { 'userId': userIds[0] }
data = table.get_item(Key = key)
print('# data = {}'.format(data))

# データを更新する (値の更新)
table.update_item(
    Key = key,
    UpdateExpression = 'set userName = :n',
    ExpressionAttributeValues = { ':n': "{0}'s name".format(key['userId']) },
)
print('# updated_data = {}'.format(table.get_item(Key = key)))

# データを更新する (配列への追加)
table.update_item(
    Key = key,
    UpdateExpression = 'SET todoList = list_append(todoList, :t)',
    ExpressionAttributeValues = { ':t': [{"todo": "new uncompleted task", "isCompleted": False }] },
)
print('# updated_data = {}'.format(table.get_item(Key = key)))

# データを削除する
for userId in userIds: 
    table.delete_item(Key = { 'userId' : userId })
print("# allData = {}".format(table.scan()))
