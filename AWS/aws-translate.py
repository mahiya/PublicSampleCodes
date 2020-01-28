import boto3
translate = boto3.Session(region_name='ap-northeast-1').client('translate')


def translate_en_to_ja(text):
    resp = translate.translate_text(
        Text=text,
        SourceLanguageCode="en",
        TargetLanguageCode="ja")
    return resp.get('TranslatedText')
