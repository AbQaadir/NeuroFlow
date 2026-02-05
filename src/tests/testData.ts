import { ArchitectureSchema, NodeType } from '../types';

export const TEST_SCHEMAS: Record<string, ArchitectureSchema> = {
    architecture: {
        nodes: [
            { id: 'client', label: 'Client App', type: NodeType.CLIENT },
            { id: 'api_gateway', label: 'API Gateway', type: NodeType.SERVICE },
            { id: 'auth_service', label: 'Auth Service', type: NodeType.SERVICE },
            { id: 'user_db', label: 'User DB', type: NodeType.DATABASE },
            { id: 'payment_service', label: 'Payment Service', type: NodeType.SERVICE },
            { id: 'external_bank', label: 'Bank API', type: NodeType.EXTERNAL }
        ],
        edges: [
            { source: 'client', target: 'api_gateway', label: 'HTTPS' },
            { source: 'api_gateway', target: 'auth_service', label: 'gRPC' },
            { source: 'auth_service', target: 'user_db', label: 'SQL' },
            { source: 'api_gateway', target: 'payment_service', label: 'gRPC' },
            { source: 'payment_service', target: 'external_bank', label: 'REST' }
        ]
    },
    flowchart: {
        nodes: [
            { id: 'start', label: 'Start', type: NodeType.START },
            { id: 'check_login', label: 'Is Logged In?', type: NodeType.DECISION },
            { id: 'show_dashboard', label: 'Show Dashboard', type: NodeType.PROCESS },
            { id: 'show_login', label: 'Show Login Page', type: NodeType.PROCESS },
            { id: 'end', label: 'End', type: NodeType.END }
        ],
        edges: [
            { source: 'start', target: 'check_login' },
            { source: 'check_login', target: 'show_dashboard', label: 'Yes' },
            { source: 'check_login', target: 'show_login', label: 'No' },
            { source: 'show_dashboard', target: 'end' },
            { source: 'show_login', target: 'end' }
        ]
    },
    mindmap: {
        nodes: [
            { id: 'root', label: 'Project Goals', type: NodeType.CENTRAL },
            { id: 'dev', label: 'Development', type: NodeType.TOPIC, parentId: 'root' },
            { id: 'marketing', label: 'Marketing', type: NodeType.TOPIC, parentId: 'root' },
            { id: 'frontend', label: 'Frontend', type: NodeType.SUBTOPIC, parentId: 'dev' },
            { id: 'backend', label: 'Backend', type: NodeType.SUBTOPIC, parentId: 'dev' },
            { id: 'social', label: 'Social Media', type: NodeType.SUBTOPIC, parentId: 'marketing' },
            { id: 'ads', label: 'Ads', type: NodeType.SUBTOPIC, parentId: 'marketing' }
        ],
        edges: [
            { source: 'root', target: 'dev' },
            { source: 'root', target: 'marketing' },
            { source: 'dev', target: 'frontend' },
            { source: 'dev', target: 'backend' },
            { source: 'marketing', target: 'social' },
            { source: 'marketing', target: 'ads' }
        ]
    },
    database: {
        nodes: [
            {
                id: 'users',
                label: 'users',
                type: NodeType.ENTITY,
                attributes: [
                    { name: 'id', dataType: 'uuid', isPK: true },
                    { name: 'email', dataType: 'varchar', isPK: false },
                    { name: 'password_hash', dataType: 'varchar', isPK: false }
                ]
            },
            {
                id: 'posts',
                label: 'posts',
                type: NodeType.ENTITY,
                attributes: [
                    { name: 'id', dataType: 'uuid', isPK: true },
                    { name: 'user_id', dataType: 'uuid', isFK: true },
                    { name: 'content', dataType: 'text', isPK: false }
                ]
            }
        ],
        edges: [
            { source: 'users', target: 'posts', label: '1:N' }
        ]
    },
    class: {
        nodes: [
            {
                id: 'animal',
                label: 'Animal',
                type: NodeType.CLASS,
                attributes: [{ name: 'name', dataType: 'string', visibility: '+' }],
                methods: [{ name: 'makeSound', returnType: 'void', visibility: '+' }]
            },
            {
                id: 'dog',
                label: 'Dog',
                type: NodeType.CLASS,
                attributes: [{ name: 'breed', dataType: 'string', visibility: '-' }],
                methods: [{ name: 'fetch', returnType: 'void', visibility: '+' }]
            }
        ],
        edges: [
            { source: 'dog', target: 'animal', label: 'extends' }
        ]
    }
};
