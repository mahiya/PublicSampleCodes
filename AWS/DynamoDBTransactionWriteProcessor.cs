using Amazon;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace Sample
{
    class DynamoDBTransactionWriteProcessor
    {
        AmazonDynamoDBClient _client;
        List<TransactWriteItem> _putItems = new List<TransactWriteItem>();
        List<TransactWriteItem> _deleteItems = new List<TransactWriteItem>();

        public DynamoDBTransactionWriteProcessor(AmazonDynamoDBClient client)
        {
            _client = client;
        }

        public async Task TransactWriteItemsAsync()
        {
            var request = new TransactWriteItemsRequest();
            request.TransactItems = new List<TransactWriteItem>();
            request.TransactItems.AddRange(_putItems);
            request.TransactItems.AddRange(_deleteItems);
            await _client.TransactWriteItemsAsync(request);
        }

        public void AddPutItem<T>(T item)
        {
            var transactItem = CreatePutTransactWriteItem(item);
            _putItems.Add(transactItem);
        }

        public void AddPutItems<T>(IEnumerable<T> items)
        {
            items.ToList().ForEach(AddPutItem);
        }

        public void AddDeleteItem<T>(T item)
        {
            var transactItem = CreateDeleteTransactWriteItem(item);
            _deleteItems.Add(transactItem);
        }

        public void AddDeleteItems<T>(IEnumerable<T> items)
        {
            items.ToList().ForEach(AddDeleteItem);
        }

        TransactWriteItem CreatePutTransactWriteItem<T>(T item)
        {
            var tableName = GetDynamoDBTableName<T>();
            var properties = typeof(T).GetProperties();
            var putItem = new Dictionary<string, AttributeValue>();
            foreach (var property in properties)
            {
                var ignore = IsIgnoreProperty(property);
                if (ignore) continue;
                var propertyName = GetDynamoDBPropertyName(property);
                var attributeValue = CreateAttributeValue(property, item);
                putItem.Add(propertyName, attributeValue);
            }

            var transactItem = new TransactWriteItem
            {
                Put = new Put
                {
                    TableName = tableName,
                    Item = putItem
                }
            };
            return transactItem;
        }

        TransactWriteItem CreateDeleteTransactWriteItem<T>(T item)
        {
            var tableName = GetDynamoDBTableName<T>();
            var properties = typeof(T).GetProperties();
            var deleteItem = new Dictionary<string, AttributeValue>();

            var partitionKeyProperty = properties.FirstOrDefault(p => p.CustomAttributes.Any(a => a.AttributeType == typeof(DynamoDBHashKeyAttribute)));
            if (partitionKeyProperty == null)
                throw new Exception();
            var pkPropertyName = GetDynamoDBPropertyName(partitionKeyProperty);
            var pkAttributeValue = CreateAttributeValue(partitionKeyProperty, item);
            deleteItem.Add(pkPropertyName, pkAttributeValue);

            var sortKeyProperty = properties.FirstOrDefault(p => p.CustomAttributes.Any(a => a.AttributeType == typeof(DynamoDBRangeKeyAttribute)));
            if (sortKeyProperty != null)
            {
                var skPropertyName = GetDynamoDBPropertyName(sortKeyProperty);
                var skAttributeValue = CreateAttributeValue(sortKeyProperty, item);
                deleteItem.Add(skPropertyName, skAttributeValue);
            }

            var transactItem = new TransactWriteItem
            {
                Delete = new Delete
                {
                    TableName = tableName,
                    Key = deleteItem
                }
            };
            return transactItem;
        }

        string GetDynamoDBTableName<T>()
        {
            if (AWSConfigsDynamoDB.Context.TypeMappings.ContainsKey(typeof(T)))
            {
                return AWSConfigsDynamoDB.Context.TypeMappings[typeof(T)].TargetTable;
            }
            var attr = (DynamoDBTableAttribute)Attribute.GetCustomAttribute(typeof(T), typeof(DynamoDBTableAttribute));
            return attr.TableName;
        }

        bool IsIgnoreProperty(PropertyInfo property)
        {
            return property.CustomAttributes.Any(a => a.AttributeType == typeof(DynamoDBIgnoreAttribute));
        }

        string GetDynamoDBPropertyName(PropertyInfo property)
        {
            var targetAttributes = new List<Type>
            {
                typeof(DynamoDBHashKeyAttribute),
                typeof(DynamoDBRangeKeyAttribute),
                typeof(DynamoDBPropertyAttribute)
            };
            foreach (var targetAttribute in targetAttributes)
            {
                var customAttribute = property.CustomAttributes.FirstOrDefault(a => a.AttributeType == targetAttribute);
                if (customAttribute == null) continue;
                if (customAttribute.ConstructorArguments.Count == 0)
                    return property.Name;
                return customAttribute.ConstructorArguments.First().Value.ToString();
            }
            return property.Name;
        }

        AttributeValue CreateAttributeValue<T>(PropertyInfo property, T item)
        {
            const string DateFotmat = "yyyy-MM-ddTHH:mm:ss.fffZ";
            var value = property.GetValue(item);
            var attributeValue = new AttributeValue();
            if (property.PropertyType == typeof(int))
            {
                attributeValue.N = value.ToString();
            }
            else if (property.PropertyType == typeof(string))
            {
                attributeValue.S = value.ToString();
            }
            else if (property.PropertyType == typeof(bool))
            {
                attributeValue.BOOL = (bool)value;
            }
            else if (property.PropertyType == typeof(DateTime))
            {
                attributeValue.S = ((DateTime)value).ToString(DateFotmat);
            }
            else if (property.PropertyType == typeof(DateTime?))
            {
                attributeValue.S = value == null ? null : ((DateTime)value).ToString(DateFotmat);
            }
            else
            {
                throw new Exception("Instance having property defined by unknow type was inputed.");
            }
            return attributeValue;
        }
    }
}
