import time
import boto3
from sagemaker import get_execution_role
region = '<Region Name>'
s3_data_dir_path = 's3://<Bucket Name>/<Data Directory Path>'
s3_data_output_path = 's3://<Bucket Name>/<Output Path>'
target_column_name = '<Target Column Name>'

auto_ml_job_name = 'automl-sample'
sm = boto3.Session().client(service_name='sagemaker', region_name=region)

# トレーニングを開始する
sm.create_auto_ml_job(
    AutoMLJobName=auto_ml_job_name,
    InputDataConfig=[{
        'DataSource': {
            'S3DataSource': {
                'S3DataType': 'S3Prefix',
                'S3Uri': s3_data_dir_path
            }
        },
        'TargetAttributeName': target_column_name
    }],
    OutputDataConfig={
        'S3OutputPath': s3_data_output_path
    },
    RoleArn=get_execution_role()
)

# トレーニング状態を確認する
while True:
    resp = sm.describe_auto_ml_job(AutoMLJobName=auto_ml_job_name)
    if resp['AutoMLJobStatus'] == 'Completed':
        break
    time.sleep(10)

# 最も精度の良い候補でモデルを作成する
best_candidate = resp['BestCandidate']
model_name = auto_ml_job_name + '-model'
model_arn = sm.create_model(
    Containers=best_candidate['InferenceContainers'],
    ModelName=model_name,
    ExecutionRoleArn=role)
