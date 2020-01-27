import time
import boto3
from sagemaker import get_execution_role
region = '<Region Name>'
s3_data_dir_path = 's3://<Bucket Name>/<Data Directory Path>'
target_column_name = '<Target Column Name>'

auto_ml_job_name = 'automl-sample'
sm = boto3.Session().client(service_name='sagemaker', region_name=region)

# トレーニングを開始する
sm.create_auto_ml_job(
    AutoMLJobName=auto_ml_job_name,
    InputDataConfig=[
        {
            'DataSource': {
                'S3DataSource': {
                    'S3DataType': 'S3Prefix',
                    'S3Uri': s3_data_dir_path
                }
            },
            'TargetAttributeName': target_column_name
        }
    ],
    OutputDataConfig={
        'S3OutputPath': 's3://{}/{}/output'.format(bucket, prefix)
    },
    RoleArn=get_execution_role()
)

# トレーニング状態を確認する
while True:
    resp = sm.describe_auto_ml_job(AutoMLJobName=auto_ml_job_name)
    status = resp['AutoMLJobStatus']
    if status == 'Completed':
        break
    time.sleep(10)

# 作成されたモデルを確認する
candidates = sm.list_candidates_for_auto_ml_job(
    AutoMLJobName=auto_ml_job_name,
    SortBy='FinalObjectiveMetricValue')['Candidates']
print(candidates)
