using System;
using System.Linq;
using System.Threading.Tasks;

// dotnet add package NEST
using Nest;

namespace AWSElasticsearchServiceSample
{
    class Program
    {
        static async Task Main()
        {
            var url = "https://xxxxx.region-name.es.amazonaws.com/";
            const string indexName = "sample-index";
            const string username = "";
            const string password = "";

            // クライアントを作成する
            var settings = new ConnectionSettings(new Uri(url))
                                            .DefaultIndex(indexName)
                                            .BasicAuthentication(username, password);
            var client = new ElasticClient(settings);

            // インデックスを作成する
            await client.Indices.CreateAsync(indexName, c => c.Map<SampleDocument>(m => m.AutoMap<SampleDocument>()));

            // １つのドキュメントをインデックス化する
            var document = new SampleDocument
            {
                Id = Guid.NewGuid(),
                Name = "Sample Document",
                Location = "35.685393,139.7506433"
            };
            await client.IndexDocumentAsync(document);

            // 複数のドキュメントをインデックス化する
            var documents = Enumerable.Range(0, 10).Select(i => new SampleDocument
            {
                Id = Guid.NewGuid(),
                Name = $"Sample Document {i}",
                Location = "35.685393,139.7506433"
            });
            await client.IndexManyAsync(documents);

            // ドキュメントを取得する
            var searchedDocuments = (await client.SearchAsync<SampleDocument>(s => s.Size(100))).Documents;

            // ドキュメントを削除する
            await client.DeleteManyAsync(searchedDocuments);
        }
    }

    class SampleDocument
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public GeoLocation Location { get; set; }
    }
}
