/**
 * Cloud Architecture Icons
 * Comprehensive icon collection for software architecture diagrams
 * Includes AWS, Azure, GCP service icons with keywords for fuzzy matching
 */

import React from 'react';

// AWS Icons from aws-react-icons
import {
    // Core Compute
    EC2,
    Lambda,
    ECS,
    EKS,
    Fargate,
    Batch,
    Lightsail,
    ElasticBeanstalk,

    // Storage  
    S3,
    EBS,
    EFS,
    FSx,
    Glacier,

    // Database
    RDS,
    Aurora,
    DynamoDB,
    ElastiCache,
    Neptune,
    DocumentDB,
    Redshift,

    // Networking
    VPC,
    CloudFront,
    Route53,
    APIGateway,
    DirectConnect,
    PrivateLink,

    // Integration & Messaging
    SQS,
    SNS,
    EventBridge,
    StepFunctions,
    AppSync,

    // Security
    IAM,
    Cognito,
    SecretsManager,
    KMS,
    WAF,
    Shield,

    // Developer Tools
    CodeBuild,
    CodeDeploy,
    CodePipeline,
    CloudFormation,

    // Analytics
    Kinesis,
    Athena,
    EMR,
    Glue,
    QuickSight,

    // Machine Learning
    SageMaker,
    Rekognition,
    Comprehend,
    Transcribe,
    Polly,

    // Container
    ECR,

    // Management
    CloudWatch,
    CloudTrail,
    Config,
    SystemsManager,
    Organizations,
} from 'aws-react-icons';

// Type for cloud icon metadata
export interface CloudIconMetadata {
    iconKey: string;
    component: React.ComponentType<{ size?: number; className?: string }>;
    keywords: string[];
    category: 'aws' | 'azure' | 'gcp' | 'kubernetes';
    priority: number;
}

// AWS Icons Registry with fuzzy matching keywords
export const AWS_CLOUD_ICONS: CloudIconMetadata[] = [
    // ============ COMPUTE ============
    {
        iconKey: 'aws-ec2',
        component: EC2,
        keywords: ['ec2', 'instance', 'virtual machine', 'vm', 'compute', 'server', 'amazon ec2'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-lambda',
        component: Lambda,
        keywords: ['lambda', 'serverless', 'function', 'faas', 'aws lambda', 'lambda function'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-ecs',
        component: ECS,
        keywords: ['ecs', 'container', 'elastic container', 'docker', 'container service'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-eks',
        component: EKS,
        keywords: ['eks', 'kubernetes', 'k8s', 'elastic kubernetes', 'kubernetes service'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-fargate',
        component: Fargate,
        keywords: ['fargate', 'serverless container', 'container', 'serverless'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-batch',
        component: Batch,
        keywords: ['batch', 'batch processing', 'job', 'hpc', 'aws batch'],
        category: 'aws',
        priority: 8
    },
    {
        iconKey: 'aws-lightsail',
        component: Lightsail,
        keywords: ['lightsail', 'vps', 'simple', 'virtual private server'],
        category: 'aws',
        priority: 7
    },
    {
        iconKey: 'aws-elastic-beanstalk',
        component: ElasticBeanstalk,
        keywords: ['beanstalk', 'elastic beanstalk', 'paas', 'deployment'],
        category: 'aws',
        priority: 8
    },

    // ============ STORAGE ============
    {
        iconKey: 'aws-s3',
        component: S3,
        keywords: ['s3', 'bucket', 'storage', 'object storage', 'simple storage', 'file storage'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-ebs',
        component: EBS,
        keywords: ['ebs', 'block storage', 'volume', 'disk', 'elastic block'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-efs',
        component: EFS,
        keywords: ['efs', 'file system', 'nfs', 'elastic file', 'shared storage'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-fsx',
        component: FSx,
        keywords: ['fsx', 'file system', 'windows', 'lustre', 'high performance'],
        category: 'aws',
        priority: 8
    },
    {
        iconKey: 'aws-glacier',
        component: Glacier,
        keywords: ['glacier', 'archive', 'cold storage', 'backup', 'long-term storage'],
        category: 'aws',
        priority: 8
    },

    // ============ DATABASE ============
    {
        iconKey: 'aws-rds',
        component: RDS,
        keywords: ['rds', 'relational', 'database', 'sql', 'mysql', 'postgres', 'oracle', 'sql server'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-aurora',
        component: Aurora,
        keywords: ['aurora', 'mysql', 'postgres', 'serverless database', 'aurora database'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-dynamodb',
        component: DynamoDB,
        keywords: ['dynamodb', 'nosql', 'key-value', 'document', 'dynamo', 'serverless database'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-elasticache',
        component: ElastiCache,
        keywords: ['elasticache', 'cache', 'redis', 'memcached', 'in-memory', 'caching'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-neptune',
        component: Neptune,
        keywords: ['neptune', 'graph', 'graph database', 'gremlin', 'sparql'],
        category: 'aws',
        priority: 8
    },
    {
        iconKey: 'aws-documentdb',
        component: DocumentDB,
        keywords: ['documentdb', 'mongodb', 'document database', 'nosql'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-redshift',
        component: Redshift,
        keywords: ['redshift', 'data warehouse', 'analytics', 'olap', 'columnar'],
        category: 'aws',
        priority: 9
    },

    // ============ NETWORKING ============
    {
        iconKey: 'aws-vpc',
        component: VPC,
        keywords: ['vpc', 'virtual private cloud', 'network', 'networking', 'private network'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-cloudfront',
        component: CloudFront,
        keywords: ['cloudfront', 'cdn', 'content delivery', 'edge', 'caching', 'distribution'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-route53',
        component: Route53,
        keywords: ['route53', 'dns', 'domain', 'routing', 'hosted zone'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-api-gateway',
        component: APIGateway,
        keywords: ['api gateway', 'api', 'gateway', 'rest', 'websocket', 'http api'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-direct-connect',
        component: DirectConnect,
        keywords: ['direct connect', 'dedicated', 'private connection', 'datacenter'],
        category: 'aws',
        priority: 8
    },
    {
        iconKey: 'aws-privatelink',
        component: PrivateLink,
        keywords: ['privatelink', 'private endpoint', 'vpc endpoint', 'private'],
        category: 'aws',
        priority: 8
    },

    // ============ MESSAGING & INTEGRATION ============
    {
        iconKey: 'aws-sqs',
        component: SQS,
        keywords: ['sqs', 'queue', 'message queue', 'messaging', 'simple queue'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-sns',
        component: SNS,
        keywords: ['sns', 'notification', 'pubsub', 'publish', 'subscribe', 'push'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-eventbridge',
        component: EventBridge,
        keywords: ['eventbridge', 'event', 'event bus', 'events', 'eventbus', 'serverless events'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-step-functions',
        component: StepFunctions,
        keywords: ['step functions', 'workflow', 'state machine', 'orchestration'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-appsync',
        component: AppSync,
        keywords: ['appsync', 'graphql', 'api', 'realtime', 'sync'],
        category: 'aws',
        priority: 9
    },

    // ============ SECURITY ============
    {
        iconKey: 'aws-iam',
        component: IAM,
        keywords: ['iam', 'identity', 'access', 'permissions', 'roles', 'policies'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-cognito',
        component: Cognito,
        keywords: ['cognito', 'auth', 'authentication', 'user pool', 'identity pool', 'login'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-secrets-manager',
        component: SecretsManager,
        keywords: ['secrets manager', 'secrets', 'credentials', 'password', 'api key'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-kms',
        component: KMS,
        keywords: ['kms', 'key management', 'encryption', 'keys', 'cryptographic'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-waf',
        component: WAF,
        keywords: ['waf', 'firewall', 'web application firewall', 'security'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-shield',
        component: Shield,
        keywords: ['shield', 'ddos', 'protection', 'ddos protection'],
        category: 'aws',
        priority: 8
    },

    // ============ DEVELOPER TOOLS ============
    {
        iconKey: 'aws-codebuild',
        component: CodeBuild,
        keywords: ['codebuild', 'build', 'ci', 'continuous integration'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-codedeploy',
        component: CodeDeploy,
        keywords: ['codedeploy', 'deploy', 'deployment', 'cd'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-codepipeline',
        component: CodePipeline,
        keywords: ['codepipeline', 'pipeline', 'cicd', 'continuous delivery'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-cloudformation',
        component: CloudFormation,
        keywords: ['cloudformation', 'infrastructure', 'iac', 'template', 'stack'],
        category: 'aws',
        priority: 9
    },

    // ============ ANALYTICS ============
    {
        iconKey: 'aws-kinesis',
        component: Kinesis,
        keywords: ['kinesis', 'streaming', 'real-time', 'data stream', 'firehose'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-athena',
        component: Athena,
        keywords: ['athena', 'query', 'sql', 's3 query', 'serverless sql'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-emr',
        component: EMR,
        keywords: ['emr', 'hadoop', 'spark', 'big data', 'elastic mapreduce'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-glue',
        component: Glue,
        keywords: ['glue', 'etl', 'data catalog', 'crawler', 'data integration'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-quicksight',
        component: QuickSight,
        keywords: ['quicksight', 'bi', 'business intelligence', 'dashboard', 'visualization'],
        category: 'aws',
        priority: 8
    },

    // ============ MACHINE LEARNING ============
    {
        iconKey: 'aws-sagemaker',
        component: SageMaker,
        keywords: ['sagemaker', 'ml', 'machine learning', 'model training', 'ai'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-rekognition',
        component: Rekognition,
        keywords: ['rekognition', 'image', 'video', 'computer vision', 'facial'],
        category: 'aws',
        priority: 8
    },
    {
        iconKey: 'aws-comprehend',
        component: Comprehend,
        keywords: ['comprehend', 'nlp', 'natural language', 'text analysis'],
        category: 'aws',
        priority: 8
    },
    {
        iconKey: 'aws-transcribe',
        component: Transcribe,
        keywords: ['transcribe', 'speech to text', 'audio', 'transcription'],
        category: 'aws',
        priority: 8
    },
    {
        iconKey: 'aws-polly',
        component: Polly,
        keywords: ['polly', 'text to speech', 'tts', 'voice', 'synthesis'],
        category: 'aws',
        priority: 8
    },

    // ============ CONTAINER ============
    {
        iconKey: 'aws-ecr',
        component: ECR,
        keywords: ['ecr', 'container registry', 'docker registry', 'image registry'],
        category: 'aws',
        priority: 9
    },

    // ============ MANAGEMENT ============
    {
        iconKey: 'aws-cloudwatch',
        component: CloudWatch,
        keywords: ['cloudwatch', 'monitoring', 'logs', 'metrics', 'alarms', 'observability'],
        category: 'aws',
        priority: 10
    },
    {
        iconKey: 'aws-cloudtrail',
        component: CloudTrail,
        keywords: ['cloudtrail', 'audit', 'logging', 'compliance', 'trail'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-config',
        component: Config,
        keywords: ['config', 'configuration', 'compliance', 'rules'],
        category: 'aws',
        priority: 8
    },
    {
        iconKey: 'aws-systems-manager',
        component: SystemsManager,
        keywords: ['systems manager', 'ssm', 'parameter store', 'patch', 'automation'],
        category: 'aws',
        priority: 9
    },
    {
        iconKey: 'aws-organizations',
        component: Organizations,
        keywords: ['organizations', 'accounts', 'multi-account', 'ou', 'scp'],
        category: 'aws',
        priority: 8
    },
];

// Helper to get all AWS icon components as a map
export const AWS_ICON_COMPONENTS: Record<string, React.ComponentType<any>> = {};
AWS_CLOUD_ICONS.forEach(icon => {
    AWS_ICON_COMPONENTS[icon.iconKey] = icon.component;
});

// Export combined cloud icons for the registry
export const ALL_CLOUD_ICONS: CloudIconMetadata[] = [
    ...AWS_CLOUD_ICONS,
    // TODO: Add Azure icons when azure-react-icons package is available
    // TODO: Add GCP icons when gcp-react-icons package is available
];

// Helper function to render a cloud icon by key
export const renderCloudIcon = (iconKey: string, size: number = 24, className?: string): React.ReactNode => {
    const IconComponent = AWS_ICON_COMPONENTS[iconKey];
    if (IconComponent) {
        return <IconComponent size={size} className={className} />;
    }
    return null;
};
