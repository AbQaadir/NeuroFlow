/**
 * Icon Registry - Searchable metadata for all icons
 * Each icon has keywords, category, and priority for smart matching
 */

export interface IconMetadata {
    iconKey: string;
    keywords: string[];
    category: 'cloud' | 'database' | 'backend' | 'frontend' | 'messaging' | 'devops' | 'security' | 'monitoring' | 'general' | 'aws' | 'azure' | 'gcp' | 'kubernetes';
    priority: number; // Higher = more specific, preferred in ties
}

export const ICON_REGISTRY: IconMetadata[] = [
    // ============ CLOUD PROVIDERS ============
    {
        iconKey: 'SiAmazon',
        keywords: ['aws', 'amazon', 'amazon web services', 'cloud', 'ec2', 's3', 'lambda'],
        category: 'cloud',
        priority: 10
    },
    {
        iconKey: 'VscAzure',
        keywords: ['azure', 'microsoft', 'microsoft azure', 'cloud', 'aks'],
        category: 'cloud',
        priority: 10
    },
    {
        iconKey: 'SiGoogle',
        keywords: ['gcp', 'google', 'google cloud', 'google cloud platform', 'gke'],
        category: 'cloud',
        priority: 10
    },

    // ============ DATABASES ============
    {
        iconKey: 'SiRedis',
        keywords: ['redis', 'cache', 'in-memory', 'elasticache', 'caching', 'session'],
        category: 'database',
        priority: 10
    },
    {
        iconKey: 'SiPostgresql',
        keywords: ['postgres', 'postgresql', 'psql', 'sql', 'relational', 'rds'],
        category: 'database',
        priority: 10
    },
    {
        iconKey: 'SiMongodb',
        keywords: ['mongo', 'mongodb', 'nosql', 'document', 'documentdb'],
        category: 'database',
        priority: 10
    },
    {
        iconKey: 'SiMysql',
        keywords: ['mysql', 'mariadb', 'sql', 'relational', 'rds'],
        category: 'database',
        priority: 10
    },
    {
        iconKey: 'SiElasticsearch',
        keywords: ['elastic', 'elasticsearch', 'elk', 'search', 'logging', 'opensearch'],
        category: 'database',
        priority: 10
    },
    {
        iconKey: 'SiSupabase',
        keywords: ['supabase', 'postgres', 'baas', 'backend as a service'],
        category: 'database',
        priority: 9
    },
    {
        iconKey: 'SiFirebase',
        keywords: ['firebase', 'firestore', 'realtime', 'google', 'baas'],
        category: 'database',
        priority: 9
    },
    {
        iconKey: 'SiPrisma',
        keywords: ['prisma', 'orm', 'database', 'schema'],
        category: 'database',
        priority: 8
    },
    {
        iconKey: 'FaDatabase',
        keywords: ['database', 'db', 'data', 'storage', 'sql', 'store'],
        category: 'database',
        priority: 5
    },

    // ============ INFRASTRUCTURE & DEVOPS ============
    {
        iconKey: 'SiKubernetes',
        keywords: ['kubernetes', 'k8s', 'container', 'orchestration', 'eks', 'gke', 'aks', 'cluster'],
        category: 'devops',
        priority: 10
    },
    {
        iconKey: 'SiDocker',
        keywords: ['docker', 'container', 'containerization', 'image', 'dockerfile'],
        category: 'devops',
        priority: 10
    },
    {
        iconKey: 'SiNginx',
        keywords: ['nginx', 'reverse proxy', 'load balancer', 'web server', 'lb'],
        category: 'devops',
        priority: 10
    },
    {
        iconKey: 'SiApache',
        keywords: ['apache', 'httpd', 'web server'],
        category: 'devops',
        priority: 9
    },
    {
        iconKey: 'SiTerraform',
        keywords: ['terraform', 'infrastructure', 'iac', 'infrastructure as code', 'hcl'],
        category: 'devops',
        priority: 10
    },
    {
        iconKey: 'SiAnsible',
        keywords: ['ansible', 'automation', 'configuration', 'playbook'],
        category: 'devops',
        priority: 9
    },
    {
        iconKey: 'SiJenkins',
        keywords: ['jenkins', 'ci', 'cd', 'cicd', 'pipeline', 'build'],
        category: 'devops',
        priority: 10
    },
    {
        iconKey: 'SiGithub',
        keywords: ['github', 'git', 'repository', 'version control', 'actions'],
        category: 'devops',
        priority: 10
    },
    {
        iconKey: 'SiGitlab',
        keywords: ['gitlab', 'git', 'repository', 'cicd', 'pipeline'],
        category: 'devops',
        priority: 10
    },
    {
        iconKey: 'SiLinux',
        keywords: ['linux', 'unix', 'os', 'operating system', 'server'],
        category: 'devops',
        priority: 8
    },
    {
        iconKey: 'SiUbuntu',
        keywords: ['ubuntu', 'linux', 'debian', 'os'],
        category: 'devops',
        priority: 8
    },

    // ============ BACKEND & LANGUAGES ============
    {
        iconKey: 'SiNodedotjs',
        keywords: ['node', 'nodejs', 'node.js', 'javascript', 'express', 'backend', 'server'],
        category: 'backend',
        priority: 10
    },
    {
        iconKey: 'SiPython',
        keywords: ['python', 'django', 'flask', 'fastapi', 'backend'],
        category: 'backend',
        priority: 10
    },
    {
        iconKey: 'SiGo',
        keywords: ['go', 'golang', 'backend'],
        category: 'backend',
        priority: 10
    },
    {
        iconKey: 'SiRust',
        keywords: ['rust', 'backend', 'systems'],
        category: 'backend',
        priority: 10
    },
    {
        iconKey: 'SiTypescript',
        keywords: ['typescript', 'ts', 'javascript', 'type'],
        category: 'backend',
        priority: 9
    },
    {
        iconKey: 'SiSpringboot',
        keywords: ['spring', 'springboot', 'java', 'backend', 'microservice'],
        category: 'backend',
        priority: 10
    },
    {
        iconKey: 'SiNestjs',
        keywords: ['nest', 'nestjs', 'node', 'typescript', 'backend'],
        category: 'backend',
        priority: 9
    },
    {
        iconKey: 'SiExpress',
        keywords: ['express', 'expressjs', 'node', 'api', 'rest'],
        category: 'backend',
        priority: 9
    },
    {
        iconKey: 'SiGraphql',
        keywords: ['graphql', 'gql', 'api', 'query', 'apollo'],
        category: 'backend',
        priority: 10
    },
    {
        iconKey: 'FaServer',
        keywords: ['server', 'backend', 'service', 'microservice', 'api', 'compute'],
        category: 'backend',
        priority: 5
    },
    {
        iconKey: 'MdApi',
        keywords: ['api', 'rest', 'restful', 'endpoint', 'gateway'],
        category: 'backend',
        priority: 6
    },

    // ============ FRONTEND & MOBILE ============
    {
        iconKey: 'SiReact',
        keywords: ['react', 'reactjs', 'frontend', 'next', 'nextjs', 'ui'],
        category: 'frontend',
        priority: 10
    },
    {
        iconKey: 'SiNextdotjs',
        keywords: ['next', 'nextjs', 'next.js', 'react', 'frontend', 'ssr'],
        category: 'frontend',
        priority: 10
    },
    {
        iconKey: 'SiVite',
        keywords: ['vite', 'frontend', 'build', 'bundler'],
        category: 'frontend',
        priority: 9
    },
    {
        iconKey: 'SiTailwindcss',
        keywords: ['tailwind', 'tailwindcss', 'css', 'styling'],
        category: 'frontend',
        priority: 8
    },
    {
        iconKey: 'SiFlutter',
        keywords: ['flutter', 'dart', 'mobile', 'cross-platform', 'app'],
        category: 'frontend',
        priority: 10
    },
    {
        iconKey: 'SiKotlin',
        keywords: ['kotlin', 'android', 'mobile', 'jvm'],
        category: 'frontend',
        priority: 10
    },
    {
        iconKey: 'SiSwift',
        keywords: ['swift', 'ios', 'apple', 'mobile', 'iphone'],
        category: 'frontend',
        priority: 10
    },
    {
        iconKey: 'SiAndroid',
        keywords: ['android', 'mobile', 'google', 'app'],
        category: 'frontend',
        priority: 10
    },
    {
        iconKey: 'SiApple',
        keywords: ['apple', 'ios', 'macos', 'iphone', 'ipad'],
        category: 'frontend',
        priority: 9
    },
    {
        iconKey: 'FaLaptopCode',
        keywords: ['client', 'frontend', 'web', 'browser', 'desktop', 'app'],
        category: 'frontend',
        priority: 5
    },
    {
        iconKey: 'FaMobileAlt',
        keywords: ['mobile', 'phone', 'app', 'ios', 'android'],
        category: 'frontend',
        priority: 6
    },
    {
        iconKey: 'MdWeb',
        keywords: ['web', 'browser', 'frontend', 'website', 'vue', 'angular', 'svelte'],
        category: 'frontend',
        priority: 5
    },

    // ============ MESSAGING & EVENTS ============
    {
        iconKey: 'SiApachekafka',
        keywords: ['kafka', 'streaming', 'events', 'event', 'pubsub', 'message'],
        category: 'messaging',
        priority: 10
    },
    {
        iconKey: 'SiRabbitmq',
        keywords: ['rabbitmq', 'rabbit', 'mq', 'message', 'queue', 'amqp'],
        category: 'messaging',
        priority: 10
    },
    {
        iconKey: 'MdQueue',
        keywords: ['queue', 'message', 'sqs', 'mq', 'async', 'job'],
        category: 'messaging',
        priority: 6
    },

    // ============ SECURITY ============
    {
        iconKey: 'SiAuth0',
        keywords: ['auth0', 'authentication', 'oauth', 'identity', 'sso'],
        category: 'security',
        priority: 10
    },
    {
        iconKey: 'FaLock',
        keywords: ['auth', 'authentication', 'authorization', 'login', 'security', 'password'],
        category: 'security',
        priority: 6
    },
    {
        iconKey: 'FaShieldAlt',
        keywords: ['security', 'protection', 'firewall', 'waf', 'shield'],
        category: 'security',
        priority: 6
    },
    {
        iconKey: 'FaKey',
        keywords: ['key', 'secret', 'credential', 'api key', 'token'],
        category: 'security',
        priority: 6
    },
    {
        iconKey: 'MdSecurity',
        keywords: ['security', 'secure', 'protection', 'ssl', 'tls'],
        category: 'security',
        priority: 5
    },

    // ============ MONITORING & OBSERVABILITY ============
    {
        iconKey: 'SiPrometheus',
        keywords: ['prometheus', 'metrics', 'monitoring', 'alerting'],
        category: 'monitoring',
        priority: 10
    },
    {
        iconKey: 'SiGrafana',
        keywords: ['grafana', 'dashboard', 'visualization', 'metrics', 'monitoring'],
        category: 'monitoring',
        priority: 10
    },
    {
        iconKey: 'SiDatadog',
        keywords: ['datadog', 'monitoring', 'apm', 'observability', 'logs'],
        category: 'monitoring',
        priority: 10
    },
    {
        iconKey: 'SiNewrelic',
        keywords: ['newrelic', 'new relic', 'apm', 'monitoring', 'observability'],
        category: 'monitoring',
        priority: 10
    },
    {
        iconKey: 'SiSentry',
        keywords: ['sentry', 'error', 'tracking', 'monitoring', 'crash'],
        category: 'monitoring',
        priority: 10
    },

    // ============ SAAS & EXTERNAL ============
    {
        iconKey: 'SiStripe',
        keywords: ['stripe', 'payment', 'billing', 'checkout', 'subscription'],
        category: 'general',
        priority: 10
    },
    {
        iconKey: 'SiPaypal',
        keywords: ['paypal', 'payment', 'checkout', 'money'],
        category: 'general',
        priority: 10
    },
    {
        iconKey: 'SiTwilio',
        keywords: ['twilio', 'sms', 'messaging', 'communication', 'phone'],
        category: 'general',
        priority: 10
    },
    {
        iconKey: 'SiOpenai',
        keywords: ['openai', 'gpt', 'chatgpt', 'llm', 'ai', 'ml', 'language model'],
        category: 'general',
        priority: 10
    },
    {
        iconKey: 'SiSlack',
        keywords: ['slack', 'messaging', 'communication', 'chat', 'notification'],
        category: 'general',
        priority: 10
    },
    {
        iconKey: 'SiDiscord',
        keywords: ['discord', 'chat', 'community', 'messaging'],
        category: 'general',
        priority: 10
    },
    {
        iconKey: 'MdEmail',
        keywords: ['email', 'mail', 'sendgrid', 'ses', 'smtp', 'notification'],
        category: 'general',
        priority: 7
    },

    // ============ GENERAL / FALLBACK ============
    {
        iconKey: 'FaCloud',
        keywords: ['cloud', 'hosting', 'infrastructure', 'group', 'cluster', 'region'],
        category: 'general',
        priority: 4
    },
    {
        iconKey: 'FaGlobe',
        keywords: ['external', 'internet', 'world', 'web', 'global', 'third party', '3rd party'],
        category: 'general',
        priority: 4
    },
    {
        iconKey: 'FaNetworkWired',
        keywords: ['network', 'vpc', 'subnet', 'routing', 'connection'],
        category: 'general',
        priority: 5
    },
    {
        iconKey: 'MdRouter',
        keywords: ['router', 'routing', 'network', 'gateway', 'nat'],
        category: 'general',
        priority: 5
    },
    {
        iconKey: 'MdStorage',
        keywords: ['storage', 'disk', 'volume', 'ebs', 'ssd', 'hdd'],
        category: 'general',
        priority: 5
    },
    {
        iconKey: 'FaHdd',
        keywords: ['storage', 'disk', 'drive', 'volume', 'persistent'],
        category: 'general',
        priority: 5
    },
    {
        iconKey: 'FaMemory',
        keywords: ['memory', 'ram', 'cache', 'in-memory'],
        category: 'general',
        priority: 5
    },
    {
        iconKey: 'FaCogs',
        keywords: ['config', 'configuration', 'settings', 'processing', 'worker'],
        category: 'general',
        priority: 4
    },
    {
        iconKey: 'FaMicrochip',
        keywords: ['processor', 'compute', 'cpu', 'chip', 'processing'],
        category: 'general',
        priority: 3
    },
    {
        iconKey: 'FaBroadcastTower',
        keywords: ['broadcast', 'streaming', 'live', 'tower', 'signal'],
        category: 'general',
        priority: 4
    },
    {
        iconKey: 'FaUserCog',
        keywords: ['user', 'admin', 'management', 'settings', 'config'],
        category: 'general',
        priority: 4
    },
];

/**
 * Category boost map - when node type matches icon category, boost the score
 */
export const CATEGORY_BOOST: Record<string, string[]> = {
    'database': ['database', 'aws', 'azure', 'gcp'],
    'service': ['backend', 'devops', 'general', 'aws', 'azure', 'gcp'],
    'client': ['frontend'],
    'queue': ['messaging', 'aws', 'azure', 'gcp'],
    'external': ['general', 'cloud', 'aws', 'azure', 'gcp'],
    'group': ['cloud', 'general', 'aws', 'azure', 'gcp', 'kubernetes'],
};
