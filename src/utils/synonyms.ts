/**
 * Synonym expansion map for icon matching
 * Maps abbreviations and common terms to their full forms
 */

export const SYNONYMS: Record<string, string[]> = {
    // Cloud Provider Abbreviations
    'aws': ['amazon', 'amazon web services'],
    'gcp': ['google cloud', 'google cloud platform', 'google'],
    'azure': ['microsoft azure', 'microsoft'],

    // AWS Services
    'ec2': ['amazon ec2', 'aws ec2', 'compute', 'server', 'instance'],
    's3': ['amazon s3', 'aws s3', 'storage', 'bucket', 'object storage'],
    'rds': ['amazon rds', 'aws rds', 'database', 'relational'],
    'sqs': ['amazon sqs', 'aws sqs', 'queue', 'message queue'],
    'sns': ['amazon sns', 'aws sns', 'notification', 'pub sub'],
    'lambda': ['aws lambda', 'serverless', 'function'],
    'dynamodb': ['amazon dynamodb', 'aws dynamodb', 'nosql'],
    'cloudfront': ['amazon cloudfront', 'cdn', 'content delivery'],
    'ecs': ['amazon ecs', 'container service'],
    'eks': ['amazon eks', 'kubernetes', 'k8s'],
    'elasticache': ['amazon elasticache', 'redis', 'memcached', 'cache'],

    // Kubernetes
    'k8s': ['kubernetes'],
    'gke': ['google kubernetes engine', 'kubernetes', 'k8s'],
    'aks': ['azure kubernetes service', 'kubernetes', 'k8s'],

    // Database Abbreviations
    'db': ['database'],
    'sql': ['postgres', 'postgresql', 'mysql', 'database', 'relational'],
    'nosql': ['mongodb', 'cassandra', 'dynamodb', 'document database'],
    'postgres': ['postgresql'],
    'psql': ['postgres', 'postgresql'],
    'mongo': ['mongodb'],
    'mysql': ['mariadb'],

    // Messaging & Events
    'mq': ['message queue', 'messagequeue', 'rabbitmq', 'queue'],
    'rabbitmq': ['rabbit mq', 'message queue', 'amqp'],
    'pubsub': ['pub sub', 'publish subscribe', 'messaging'],

    // Infrastructure
    'lb': ['load balancer', 'nginx', 'haproxy', 'elb', 'alb'],
    'cdn': ['cloudfront', 'cloudflare', 'content delivery', 'edge'],
    'dns': ['route53', 'domain name', 'nameserver'],
    'vpc': ['virtual private cloud', 'network', 'vnet'],
    'vm': ['virtual machine', 'ec2', 'compute', 'server'],

    // Security & Auth
    'auth': ['authentication', 'authorization', 'oauth', 'jwt', 'login'],
    'oauth': ['oauth2', 'authentication', 'authorization'],
    'jwt': ['json web token', 'token', 'authentication'],
    'iam': ['identity', 'access management', 'permissions'],
    'ssl': ['tls', 'certificate', 'https', 'security'],

    // DevOps & CI/CD
    'ci': ['continuous integration', 'jenkins', 'github actions'],
    'cd': ['continuous deployment', 'continuous delivery'],
    'cicd': ['ci cd', 'pipeline', 'jenkins', 'github actions'],

    // Caching
    'cache': ['redis', 'memcached', 'in-memory', 'caching'],

    // API
    'api': ['rest', 'restful', 'gateway', 'endpoint'],
    'rest': ['restful', 'api', 'http'],
    'graphql': ['gql', 'graph ql'],
    'grpc': ['rpc', 'protocol buffers'],

    // Frontend/Backend
    'fe': ['frontend', 'front end', 'client'],
    'be': ['backend', 'back end', 'server'],
    'ui': ['user interface', 'frontend', 'client'],
    'ux': ['user experience'],

    // Monitoring
    'logs': ['logging', 'log', 'elasticsearch', 'elk'],
    'elk': ['elasticsearch', 'logstash', 'kibana', 'logging'],
    'apm': ['application performance', 'monitoring', 'datadog', 'newrelic'],

    // Storage
    'blob': ['blob storage', 'object storage', 's3'],
    'fs': ['file system', 'storage', 'files'],
    'nfs': ['network file system', 'file storage'],
};

/**
 * Expands a search term to include synonyms
 * @param term - The original search term
 * @returns Array of expanded terms including the original
 */
export const expandSynonyms = (text: string): string[] => {
    const words = text.toLowerCase().split(/\s+/);
    const expanded = new Set<string>([text.toLowerCase()]);

    words.forEach(word => {
        // Check if this word has synonyms
        if (SYNONYMS[word]) {
            SYNONYMS[word].forEach(syn => expanded.add(syn));
        }

        // Also check if this word IS a synonym of something
        Object.entries(SYNONYMS).forEach(([key, synonyms]) => {
            if (synonyms.some(s => s.includes(word) || word.includes(s))) {
                expanded.add(key);
                synonyms.forEach(syn => expanded.add(syn));
            }
        });
    });

    return Array.from(expanded);
};
