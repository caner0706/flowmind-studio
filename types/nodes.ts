// Node Kategorileri
export type NodeCategory = 
  | "triggers"
  | "flow-logic"
  | "ai-nodes"
  | "integrations"
  | "data-utils"
  | "outputs";

// Node Tipleri
export type NodeType =
  // Triggers
  | "start"
  | "webhook_trigger"
  | "schedule_trigger"
  | "email_trigger"
  | "file_watch_trigger"
  // Flow & Logic
  | "decision"
  | "switch"
  | "delay"
  | "parallel_split"
  | "parallel_join"
  | "loop"
  | "merge"
  | "wait"
  // AI Nodes
  | "ai_step"
  | "ai_classify"
  | "ai_extract"
  | "ai_simulate"
  | "ai_embed"
  | "ai_summarize"
  | "ai_translate"
  // Integrations - HTTP & Webhooks
  | "http"
  | "webhook_call"
  | "rest_api"
  | "graphql"
  // Integrations - Database
  | "db_query"
  | "db_insert"
  | "db_update"
  | "db_delete"
  // Integrations - Google
  | "google_sheets"
  | "google_drive"
  | "google_calendar"
  | "google_gmail"
  | "google_analytics"
  | "google_cloud_storage"
  // Integrations - Communication
  | "slack"
  | "discord"
  | "telegram"
  | "whatsapp"
  | "sms"
  // Integrations - Cloud Storage
  | "aws_s3"
  | "azure_blob"
  | "dropbox"
  // Integrations - Productivity
  | "notion"
  | "airtable"
  | "trello"
  | "asana"
  | "jira"
  // Integrations - E-commerce
  | "shopify"
  | "woocommerce"
  | "stripe"
  | "paypal"
  // Integrations - Social Media
  | "twitter"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "youtube"
  // Integrations - CRM
  | "salesforce"
  | "hubspot"
  | "zoho"
  // Data & Utils
  | "transform"
  | "filter"
  | "map_fields"
  | "log"
  | "set_variable"
  | "get_variable"
  | "json_parse"
  | "json_stringify"
  | "csv_parse"
  | "csv_generate"
  | "xml_parse"
  | "base64_encode"
  | "base64_decode"
  | "hash"
  | "encrypt"
  | "decrypt"
  // Outputs
  | "output"
  | "notify"
  | "email_send"
  | "file_write"
  | "file_download";

// Node Metadata
export interface NodeMetadata {
  type: NodeType;
  category: NodeCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
  inputs: number | string[]; // Input port sayısı veya named inputs
  outputs: number | string[]; // Output port sayısı veya named outputs
  configSchema: NodeConfigSchema;
  phase?: 1 | 2 | 3; // Hangi fazda implement edilecek
}

// Config Schema
export interface NodeConfigSchema {
  [key: string]: {
    type: "string" | "number" | "boolean" | "object" | "array" | "select" | "textarea";
    label: string;
    description?: string;
    required?: boolean;
    default?: any;
    options?: { value: string; label: string }[]; // select için
    placeholder?: string;
    min?: number; // number için
    max?: number; // number için
    step?: number; // number için
    rows?: number; // textarea için
  };
}

// Node Config Types
export interface StartConfig {
  name?: string;
  input_schema?: any;
}

export interface WebhookTriggerConfig {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  auth_required: boolean;
}

export interface DecisionConfig {
  conditions: Array<{
    label: string;
    expression: string;
  }>;
}

export interface DelayConfig {
  duration_ms?: number;
  duration_human?: string; // "5 minutes", "1 hour" vs.
}

export interface AIStepConfig {
  provider: "openai" | "hf" | "local";
  model: string;
  system_prompt?: string;
  user_template: string;
  output_mode: "text" | "json" | "classification";
  temperature: number;
  max_tokens: number;
}

export interface AIClassifyConfig {
  labels: string[];
  instruction: string;
}

export interface AIExtractConfig {
  schema: any; // JSON Schema
}

export interface HTTPConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  headers?: Record<string, string>;
  body?: string;
  timeout_ms?: number;
  retry_policy?: any;
}

export interface TransformConfig {
  script_type: "jsonata" | "js" | "jinja";
  expression: string;
}

export interface FilterConfig {
  expression: string;
  mode: "continue" | "stop" | "branch_error";
}

export interface OutputConfig {
  payload_template: string;
}

// Node Registry - Tüm node'ların metadata'sı
export const NODE_REGISTRY: Record<NodeType, NodeMetadata> = {
  // ========== TRIGGERS ==========
  start: {
    type: "start",
    category: "triggers",
    label: "Start",
    description: "Workflow başlangıç noktası",
    icon: "Play",
    color: "bg-green-600",
    inputs: 0,
    outputs: 1,
    phase: 1,
    configSchema: {
      name: {
        type: "string",
        label: "Name",
        description: "Opsiyonel başlangıç noktası adı",
        required: false,
        default: "Default Start",
      },
    },
  },
  
  webhook_trigger: {
    type: "webhook_trigger",
    category: "triggers",
    label: "Webhook Trigger",
    description: "HTTP çağrısı ile workflow'u tetikler",
    icon: "Webhook",
    color: "bg-blue-600",
    inputs: 0,
    outputs: 1,
    phase: 2,
    configSchema: {
      path: {
        type: "string",
        label: "Path",
        description: "Webhook URL path",
        required: true,
        placeholder: "/webhooks/my-flow",
      },
      method: {
        type: "select",
        label: "Method",
        required: true,
        default: "POST",
        options: [
          { value: "GET", label: "GET" },
          { value: "POST", label: "POST" },
          { value: "PUT", label: "PUT" },
          { value: "DELETE", label: "DELETE" },
        ],
      },
      auth_required: {
        type: "boolean",
        label: "Auth Required",
        required: false,
        default: false,
      },
    },
  },
  
  schedule_trigger: {
    type: "schedule_trigger",
    category: "triggers",
    label: "Schedule",
    description: "Zamana bağlı tetikleme (Cron)",
    icon: "Clock",
    color: "bg-purple-600",
    inputs: 0,
    outputs: 1,
    phase: 2,
    configSchema: {
      cron: {
        type: "string",
        label: "Cron Expression",
        required: true,
        placeholder: "0 * * * *",
      },
      timezone: {
        type: "string",
        label: "Timezone",
        required: false,
        default: "UTC",
      },
    },
  },
  
  // ========== FLOW & LOGIC ==========
  decision: {
    type: "decision",
    category: "flow-logic",
    label: "Decision",
    description: "Koşullu dallanma (if/else)",
    icon: "GitBranch",
    color: "bg-yellow-600",
    inputs: 1,
    outputs: ["true", "false"],
    phase: 1,
    configSchema: {
      conditions: {
        type: "array",
        label: "Conditions",
        description: "Koşul listesi",
        required: true,
        default: [],
      },
    },
  },
  
  switch: {
    type: "switch",
    category: "flow-logic",
    label: "Switch",
    description: "Multi-branch yönlendirme",
    icon: "GitBranch",
    color: "bg-yellow-500",
    inputs: 1,
    outputs: ["default"],
    phase: 2,
    configSchema: {
      expression: {
        type: "string",
        label: "Expression",
        required: true,
        placeholder: "{{ context.status }}",
      },
      cases: {
        type: "array",
        label: "Cases",
        required: true,
        default: [],
      },
    },
  },
  
  delay: {
    type: "delay",
    category: "flow-logic",
    label: "Delay",
    description: "Bekleme süresi",
    icon: "Clock",
    color: "bg-gray-600",
    inputs: 1,
    outputs: 1,
    phase: 1,
    configSchema: {
      duration_ms: {
        type: "number",
        label: "Duration (ms)",
        required: false,
        placeholder: "5000",
      },
      duration_human: {
        type: "string",
        label: "Duration (Human)",
        required: false,
        placeholder: "5 minutes",
      },
    },
  },
  
  parallel_split: {
    type: "parallel_split",
    category: "flow-logic",
    label: "Parallel Split",
    description: "Paralel branch'ler başlatma",
    icon: "GitBranch",
    color: "bg-indigo-600",
    inputs: 1,
    outputs: ["branch_1", "branch_2"],
    phase: 2,
    configSchema: {},
  },
  
  parallel_join: {
    type: "parallel_join",
    category: "flow-logic",
    label: "Parallel Join",
    description: "Paralel branch'leri birleştirme",
    icon: "GitMerge",
    color: "bg-indigo-500",
    inputs: ["branch_1", "branch_2"],
    outputs: 1,
    phase: 2,
    configSchema: {},
  },
  
  loop: {
    type: "loop",
    category: "flow-logic",
    label: "Loop",
    description: "Liste üzerinde dönme",
    icon: "Repeat",
    color: "bg-cyan-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      collection: {
        type: "string",
        label: "Collection",
        required: true,
        placeholder: "{{ context.items }}",
      },
    },
  },
  
  // ========== AI NODES ==========
  ai_step: {
    type: "ai_step",
    category: "ai-nodes",
    label: "AI Step",
    description: "LLM Completion - Genel amaçlı AI node",
    icon: "Brain",
    color: "bg-purple-600",
    inputs: 1,
    outputs: 1,
    phase: 1,
    configSchema: {
      provider: {
        type: "select",
        label: "Provider",
        required: true,
        default: "openai",
        options: [
          { value: "openai", label: "OpenAI (GPT-4, GPT-3.5)" },
          { value: "anthropic", label: "Anthropic (Claude)" },
          { value: "google", label: "Google (Gemini)" },
          { value: "mistral", label: "Mistral AI" },
          { value: "cohere", label: "Cohere" },
          { value: "hf", label: "HuggingFace" },
          { value: "azure_openai", label: "Azure OpenAI" },
          { value: "aws_bedrock", label: "AWS Bedrock" },
          { value: "local", label: "Local Model" },
        ],
      },
      model: {
        type: "string",
        label: "Model",
        required: true,
        placeholder: "gpt-4.1-mini",
      },
      system_prompt: {
        type: "textarea",
        label: "System Prompt",
        required: false,
        placeholder: "You are a helpful assistant...",
      },
      user_template: {
        type: "textarea",
        label: "User Template",
        required: true,
        placeholder: "Kullanıcının mesajı: {{input.text}}",
      },
      output_mode: {
        type: "select",
        label: "Output Mode",
        required: true,
        default: "text",
        options: [
          { value: "text", label: "Text" },
          { value: "json", label: "JSON" },
          { value: "classification", label: "Classification" },
        ],
      },
      temperature: {
        type: "number",
        label: "Temperature",
        required: false,
        default: 0.7,
      },
      max_tokens: {
        type: "number",
        label: "Max Tokens",
        required: false,
        default: 1000,
      },
    },
  },
  
  ai_classify: {
    type: "ai_classify",
    category: "ai-nodes",
    label: "AI Classify",
    description: "Metin sınıflandırma",
    icon: "Brain",
    color: "bg-purple-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      labels: {
        type: "array",
        label: "Labels",
        required: true,
        default: [],
      },
      instruction: {
        type: "textarea",
        label: "Instruction",
        required: true,
      },
    },
  },
  
  ai_extract: {
    type: "ai_extract",
    category: "ai-nodes",
    label: "AI Extract",
    description: "Structured data extraction",
    icon: "Brain",
    color: "bg-purple-400",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      schema: {
        type: "object",
        label: "Schema",
        required: true,
      },
    },
  },
  
  ai_simulate: {
    type: "ai_simulate",
    category: "ai-nodes",
    label: "AI Simulate",
    description: "Flow simulator - akışı simüle eder",
    icon: "PlayCircle",
    color: "bg-pink-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      simulation_mode: {
        type: "select",
        label: "Simulation Mode",
        required: true,
        default: "dry-run",
        options: [
          { value: "dry-run", label: "Dry Run" },
          { value: "explain", label: "Explain" },
          { value: "step-by-step", label: "Step by Step" },
        ],
      },
    },
  },
  
  // ========== INTEGRATIONS ==========
  http: {
    type: "http",
    category: "integrations",
    label: "HTTP Request",
    description: "API çağrısı yapma",
    icon: "Globe",
    color: "bg-blue-600",
    inputs: 1,
    outputs: 1,
    phase: 1,
    configSchema: {
      method: {
        type: "select",
        label: "Method",
        required: true,
        default: "GET",
        options: [
          { value: "GET", label: "GET" },
          { value: "POST", label: "POST" },
          { value: "PUT", label: "PUT" },
          { value: "DELETE", label: "DELETE" },
          { value: "PATCH", label: "PATCH" },
        ],
      },
      url: {
        type: "string",
        label: "URL",
        required: true,
        placeholder: "https://api.example.com/users/{{userId}}",
      },
      headers: {
        type: "object",
        label: "Headers",
        required: false,
      },
      body: {
        type: "textarea",
        label: "Body",
        required: false,
        placeholder: "JSON veya string",
      },
      timeout_ms: {
        type: "number",
        label: "Timeout (ms)",
        required: false,
        default: 30000,
      },
    },
  },
  
  webhook_call: {
    type: "webhook_call",
    category: "integrations",
    label: "Webhook Call",
    description: "Dış sistemlere event gönderme",
    icon: "Webhook",
    color: "bg-blue-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      url: {
        type: "string",
        label: "URL",
        required: true,
      },
      method: {
        type: "select",
        label: "Method",
        required: true,
        default: "POST",
        options: [
          { value: "POST", label: "POST" },
          { value: "PUT", label: "PUT" },
        ],
      },
      body: {
        type: "textarea",
        label: "Body",
        required: false,
      },
    },
  },
  
  db_query: {
    type: "db_query",
    category: "integrations",
    label: "Database Query",
    description: "SQL query çalıştırma",
    icon: "Database",
    color: "bg-teal-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      connection: {
        type: "string",
        label: "Connection",
        required: true,
      },
      query: {
        type: "textarea",
        label: "Query",
        required: true,
        placeholder: "SELECT * FROM users WHERE id = {{user_id}}",
      },
    },
  },
  
  // ========== DATA & UTILS ==========
  transform: {
    type: "transform",
    category: "data-utils",
    label: "Transform",
    description: "Veri dönüşümü",
    icon: "Settings",
    color: "bg-indigo-600",
    inputs: 1,
    outputs: 1,
    phase: 1,
    configSchema: {
      script_type: {
        type: "select",
        label: "Script Type",
        required: true,
        default: "js",
        options: [
          { value: "jsonata", label: "JSONata" },
          { value: "js", label: "JavaScript" },
          { value: "jinja", label: "Jinja" },
        ],
      },
      expression: {
        type: "textarea",
        label: "Expression",
        required: true,
        placeholder: "return { fullName: ctx.firstName + ' ' + ctx.lastName }",
      },
    },
  },
  
  filter: {
    type: "filter",
    category: "data-utils",
    label: "Filter",
    description: "Şart kontrolü ve filtreleme",
    icon: "Filter",
    color: "bg-pink-600",
    inputs: 1,
    outputs: ["pass", "fail"],
    phase: 1,
    configSchema: {
      expression: {
        type: "string",
        label: "Expression",
        required: true,
        placeholder: "{{ context.amount > 1000 }}",
      },
      mode: {
        type: "select",
        label: "Mode",
        required: true,
        default: "continue",
        options: [
          { value: "continue", label: "Continue" },
          { value: "stop", label: "Stop" },
          { value: "branch_error", label: "Branch Error" },
        ],
      },
    },
  },
  
  map_fields: {
    type: "map_fields",
    category: "data-utils",
    label: "Map Fields",
    description: "Alan eşleştirme",
    icon: "ArrowRightLeft",
    color: "bg-orange-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      mappings: {
        type: "array",
        label: "Mappings",
        required: true,
        default: [],
      },
    },
  },
  
  log: {
    type: "log",
    category: "data-utils",
    label: "Log",
    description: "Debug için loglama",
    icon: "FileText",
    color: "bg-gray-500",
    inputs: 1,
    outputs: 1,
    phase: 1,
    configSchema: {
      message_template: {
        type: "textarea",
        label: "Message Template",
        required: true,
        placeholder: "Current user: {{context.userId}}",
      },
    },
  },
  
  // ========== OUTPUTS ==========
  output: {
    type: "output",
    category: "outputs",
    label: "Output",
    description: "Workflow çıktısı",
    icon: "FileOutput",
    color: "bg-orange-600",
    inputs: 1,
    outputs: 0,
    phase: 1,
    configSchema: {
      payload_template: {
        type: "textarea",
        label: "Payload Template",
        required: false,
        placeholder: "{{ context.result }}",
      },
    },
  },
  
  notify: {
    type: "notify",
    category: "outputs",
    label: "Notify",
    description: "Bildirim gönderme",
    icon: "Bell",
    color: "bg-yellow-500",
    inputs: 1,
    outputs: 0,
    phase: 2,
    configSchema: {
      channel: {
        type: "select",
        label: "Channel",
        required: true,
        default: "email",
        options: [
          { value: "email", label: "Email" },
          { value: "webhook", label: "Webhook" },
          { value: "slack", label: "Slack" },
        ],
      },
      target: {
        type: "string",
        label: "Target",
        required: true,
        placeholder: "email@example.com veya webhook URL",
      },
      message_template: {
        type: "textarea",
        label: "Message Template",
        required: true,
      },
    },
  },

  // ========== YENİ TRIGGERS ==========
  email_trigger: {
    type: "email_trigger",
    category: "triggers",
    label: "Email Trigger",
    description: "Gelen e-posta ile workflow'u tetikler",
    icon: "Mail",
    color: "bg-blue-500",
    inputs: 0,
    outputs: 1,
    phase: 2,
    configSchema: {
      email_address: {
        type: "string",
        label: "Email Address",
        required: true,
        placeholder: "trigger@example.com",
      },
      filter_subject: {
        type: "string",
        label: "Subject Filter",
        required: false,
        placeholder: "Optional subject filter",
      },
    },
  },

  file_watch_trigger: {
    type: "file_watch_trigger",
    category: "triggers",
    label: "File Watch",
    description: "Dosya değişikliklerini izler",
    icon: "File",
    color: "bg-indigo-500",
    inputs: 0,
    outputs: 1,
    phase: 2,
    configSchema: {
      watch_path: {
        type: "string",
        label: "Watch Path",
        required: true,
        placeholder: "/path/to/watch",
      },
      file_pattern: {
        type: "string",
        label: "File Pattern",
        required: false,
        placeholder: "*.json",
      },
    },
  },

  // ========== YENİ FLOW & LOGIC ==========
  merge: {
    type: "merge",
    category: "flow-logic",
    label: "Merge",
    description: "Birden fazla branch'i birleştirir",
    icon: "GitMerge",
    color: "bg-indigo-500",
    inputs: ["branch_1", "branch_2"],
    outputs: 1,
    phase: 2,
    configSchema: {
      merge_strategy: {
        type: "select",
        label: "Merge Strategy",
        required: true,
        default: "all",
        options: [
          { value: "all", label: "Wait for All" },
          { value: "first", label: "First to Complete" },
        ],
      },
    },
  },

  wait: {
    type: "wait",
    category: "flow-logic",
    label: "Wait",
    description: "Belirli bir koşul gerçekleşene kadar bekler",
    icon: "Clock",
    color: "bg-gray-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      wait_condition: {
        type: "string",
        label: "Wait Condition",
        required: true,
        placeholder: "{{ context.status === 'ready' }}",
      },
      timeout_seconds: {
        type: "number",
        label: "Timeout (seconds)",
        required: false,
        default: 60,
      },
    },
  },

  // ========== YENİ AI NODES ==========
  ai_embed: {
    type: "ai_embed",
    category: "ai-nodes",
    label: "AI Embed",
    description: "Metni vektör embedding'e dönüştürür",
    icon: "Brain",
    color: "bg-purple-400",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      provider: {
        type: "select",
        label: "Provider",
        required: true,
        default: "openai",
        options: [
          { value: "openai", label: "OpenAI" },
          { value: "cohere", label: "Cohere" },
          { value: "hf", label: "HuggingFace" },
        ],
      },
      model: {
        type: "string",
        label: "Model",
        required: true,
        placeholder: "text-embedding-ada-002",
      },
    },
  },

  ai_summarize: {
    type: "ai_summarize",
    category: "ai-nodes",
    label: "AI Summarize",
    description: "Metni özetler",
    icon: "Brain",
    color: "bg-purple-300",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      max_length: {
        type: "number",
        label: "Max Length",
        required: false,
        default: 200,
      },
      style: {
        type: "select",
        label: "Style",
        required: false,
        default: "concise",
        options: [
          { value: "concise", label: "Concise" },
          { value: "detailed", label: "Detailed" },
          { value: "bullet", label: "Bullet Points" },
        ],
      },
    },
  },

  ai_translate: {
    type: "ai_translate",
    category: "ai-nodes",
    label: "AI Translate",
    description: "Metni farklı dillere çevirir",
    icon: "Brain",
    color: "bg-purple-200",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      target_language: {
        type: "string",
        label: "Target Language",
        required: true,
        placeholder: "en, tr, de, fr",
      },
      source_language: {
        type: "string",
        label: "Source Language (auto-detect if empty)",
        required: false,
      },
    },
  },

  // ========== YENİ INTEGRATIONS - HTTP ==========
  rest_api: {
    type: "rest_api",
    category: "integrations",
    label: "REST API",
    description: "RESTful API çağrısı",
    icon: "Globe",
    color: "bg-blue-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      endpoint: {
        type: "string",
        label: "Endpoint",
        required: true,
      },
      method: {
        type: "select",
        label: "Method",
        required: true,
        default: "GET",
        options: [
          { value: "GET", label: "GET" },
          { value: "POST", label: "POST" },
          { value: "PUT", label: "PUT" },
          { value: "DELETE", label: "DELETE" },
          { value: "PATCH", label: "PATCH" },
        ],
      },
      authentication: {
        type: "select",
        label: "Authentication",
        required: false,
        default: "none",
        options: [
          { value: "none", label: "None" },
          { value: "bearer", label: "Bearer Token" },
          { value: "basic", label: "Basic Auth" },
          { value: "oauth2", label: "OAuth 2.0" },
        ],
      },
    },
  },

  graphql: {
    type: "graphql",
    category: "integrations",
    label: "GraphQL",
    description: "GraphQL query/mutation",
    icon: "Code",
    color: "bg-pink-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      endpoint: {
        type: "string",
        label: "GraphQL Endpoint",
        required: true,
        placeholder: "https://api.example.com/graphql",
      },
      query: {
        type: "textarea",
        label: "Query/Mutation",
        required: true,
        rows: 8,
      },
      variables: {
        type: "object",
        label: "Variables",
        required: false,
      },
    },
  },

  // ========== YENİ INTEGRATIONS - DATABASE ==========
  db_insert: {
    type: "db_insert",
    category: "integrations",
    label: "DB Insert",
    description: "Veritabanına kayıt ekler",
    icon: "Database",
    color: "bg-teal-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      connection: {
        type: "string",
        label: "Connection",
        required: true,
      },
      table: {
        type: "string",
        label: "Table",
        required: true,
      },
      data: {
        type: "object",
        label: "Data",
        required: true,
      },
    },
  },

  db_update: {
    type: "db_update",
    category: "integrations",
    label: "DB Update",
    description: "Veritabanı kaydını günceller",
    icon: "Database",
    color: "bg-teal-400",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      connection: {
        type: "string",
        label: "Connection",
        required: true,
      },
      table: {
        type: "string",
        label: "Table",
        required: true,
      },
      where: {
        type: "string",
        label: "WHERE Clause",
        required: true,
        placeholder: "id = {{ context.id }}",
      },
      data: {
        type: "object",
        label: "Data",
        required: true,
      },
    },
  },

  db_delete: {
    type: "db_delete",
    category: "integrations",
    label: "DB Delete",
    description: "Veritabanı kaydını siler",
    icon: "Database",
    color: "bg-red-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      connection: {
        type: "string",
        label: "Connection",
        required: true,
      },
      table: {
        type: "string",
        label: "Table",
        required: true,
      },
      where: {
        type: "string",
        label: "WHERE Clause",
        required: true,
      },
    },
  },

  // ========== GOOGLE INTEGRATIONS ==========
  google_sheets: {
    type: "google_sheets",
    category: "integrations",
    label: "Google Sheets",
    description: "Google Sheets ile çalışır",
    icon: "FileSpreadsheet",
    color: "bg-green-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "read",
        options: [
          { value: "read", label: "Read Range" },
          { value: "write", label: "Write Range" },
          { value: "append", label: "Append Row" },
          { value: "update", label: "Update Cell" },
        ],
      },
      spreadsheet_id: {
        type: "string",
        label: "Spreadsheet ID",
        required: true,
      },
      range: {
        type: "string",
        label: "Range",
        required: true,
        placeholder: "Sheet1!A1:B10",
      },
      credentials: {
        type: "string",
        label: "Credentials (JSON)",
        required: true,
        description: "Google Service Account JSON",
      },
    },
  },

  google_drive: {
    type: "google_drive",
    category: "integrations",
    label: "Google Drive",
    description: "Google Drive dosya işlemleri",
    icon: "HardDrive",
    color: "bg-blue-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "list",
        options: [
          { value: "list", label: "List Files" },
          { value: "download", label: "Download File" },
          { value: "upload", label: "Upload File" },
          { value: "delete", label: "Delete File" },
          { value: "share", label: "Share File" },
        ],
      },
      file_id: {
        type: "string",
        label: "File ID",
        required: false,
      },
      folder_id: {
        type: "string",
        label: "Folder ID",
        required: false,
      },
    },
  },

  google_calendar: {
    type: "google_calendar",
    category: "integrations",
    label: "Google Calendar",
    description: "Google Calendar etkinlik yönetimi",
    icon: "Calendar",
    color: "bg-blue-400",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "list",
        options: [
          { value: "list", label: "List Events" },
          { value: "create", label: "Create Event" },
          { value: "update", label: "Update Event" },
          { value: "delete", label: "Delete Event" },
        ],
      },
      calendar_id: {
        type: "string",
        label: "Calendar ID",
        required: false,
        default: "primary",
      },
    },
  },

  google_gmail: {
    type: "google_gmail",
    category: "integrations",
    label: "Gmail",
    description: "Gmail e-posta işlemleri",
    icon: "Mail",
    color: "bg-red-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "send",
        options: [
          { value: "send", label: "Send Email" },
          { value: "read", label: "Read Emails" },
          { value: "search", label: "Search Emails" },
        ],
      },
      to: {
        type: "string",
        label: "To",
        required: false,
      },
      subject: {
        type: "string",
        label: "Subject",
        required: false,
      },
      body: {
        type: "textarea",
        label: "Body",
        required: false,
      },
    },
  },

  google_analytics: {
    type: "google_analytics",
    category: "integrations",
    label: "Google Analytics",
    description: "Google Analytics veri çekme",
    icon: "BarChart",
    color: "bg-orange-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      property_id: {
        type: "string",
        label: "Property ID",
        required: true,
      },
      date_range: {
        type: "string",
        label: "Date Range",
        required: false,
        default: "7daysAgo",
      },
      metrics: {
        type: "array",
        label: "Metrics",
        required: true,
        default: ["sessions", "users"],
      },
    },
  },

  google_cloud_storage: {
    type: "google_cloud_storage",
    category: "integrations",
    label: "Google Cloud Storage",
    description: "GCS bucket işlemleri",
    icon: "Cloud",
    color: "bg-blue-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "upload",
        options: [
          { value: "upload", label: "Upload" },
          { value: "download", label: "Download" },
          { value: "list", label: "List Objects" },
          { value: "delete", label: "Delete" },
        ],
      },
      bucket: {
        type: "string",
        label: "Bucket Name",
        required: true,
      },
      object_path: {
        type: "string",
        label: "Object Path",
        required: false,
      },
    },
  },

  // ========== COMMUNICATION INTEGRATIONS ==========
  slack: {
    type: "slack",
    category: "integrations",
    label: "Slack",
    description: "Slack mesaj gönderme",
    icon: "MessageSquare",
    color: "bg-purple-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "send_message",
        options: [
          { value: "send_message", label: "Send Message" },
          { value: "send_dm", label: "Send DM" },
          { value: "create_channel", label: "Create Channel" },
        ],
      },
      channel: {
        type: "string",
        label: "Channel",
        required: true,
        placeholder: "#general",
      },
      message: {
        type: "textarea",
        label: "Message",
        required: true,
      },
      bot_token: {
        type: "string",
        label: "Bot Token",
        required: true,
      },
    },
  },

  discord: {
    type: "discord",
    category: "integrations",
    label: "Discord",
    description: "Discord mesaj gönderme",
    icon: "MessageCircle",
    color: "bg-indigo-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      webhook_url: {
        type: "string",
        label: "Webhook URL",
        required: true,
      },
      message: {
        type: "textarea",
        label: "Message",
        required: true,
      },
      username: {
        type: "string",
        label: "Username",
        required: false,
      },
    },
  },

  telegram: {
    type: "telegram",
    category: "integrations",
    label: "Telegram",
    description: "Telegram mesaj gönderme",
    icon: "Send",
    color: "bg-blue-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      bot_token: {
        type: "string",
        label: "Bot Token",
        required: true,
      },
      chat_id: {
        type: "string",
        label: "Chat ID",
        required: true,
      },
      message: {
        type: "textarea",
        label: "Message",
        required: true,
      },
    },
  },

  whatsapp: {
    type: "whatsapp",
    category: "integrations",
    label: "WhatsApp",
    description: "WhatsApp mesaj gönderme",
    icon: "MessageSquare",
    color: "bg-green-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      phone_number: {
        type: "string",
        label: "Phone Number",
        required: true,
        placeholder: "+1234567890",
      },
      message: {
        type: "textarea",
        label: "Message",
        required: true,
      },
      api_key: {
        type: "string",
        label: "API Key",
        required: true,
      },
    },
  },

  sms: {
    type: "sms",
    category: "integrations",
    label: "SMS",
    description: "SMS gönderme",
    icon: "Phone",
    color: "bg-green-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      provider: {
        type: "select",
        label: "Provider",
        required: true,
        default: "twilio",
        options: [
          { value: "twilio", label: "Twilio" },
          { value: "aws_sns", label: "AWS SNS" },
        ],
      },
      to: {
        type: "string",
        label: "To",
        required: true,
      },
      message: {
        type: "string",
        label: "Message",
        required: true,
      },
    },
  },

  // ========== CLOUD STORAGE ==========
  aws_s3: {
    type: "aws_s3",
    category: "integrations",
    label: "AWS S3",
    description: "Amazon S3 işlemleri",
    icon: "Cloud",
    color: "bg-orange-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "upload",
        options: [
          { value: "upload", label: "Upload" },
          { value: "download", label: "Download" },
          { value: "list", label: "List Objects" },
          { value: "delete", label: "Delete" },
        ],
      },
      bucket: {
        type: "string",
        label: "Bucket",
        required: true,
      },
      key: {
        type: "string",
        label: "Object Key",
        required: false,
      },
      access_key: {
        type: "string",
        label: "Access Key",
        required: true,
      },
      secret_key: {
        type: "string",
        label: "Secret Key",
        required: true,
      },
    },
  },

  azure_blob: {
    type: "azure_blob",
    category: "integrations",
    label: "Azure Blob Storage",
    description: "Azure Blob Storage işlemleri",
    icon: "Cloud",
    color: "bg-blue-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "upload",
        options: [
          { value: "upload", label: "Upload" },
          { value: "download", label: "Download" },
          { value: "list", label: "List Blobs" },
        ],
      },
      container: {
        type: "string",
        label: "Container",
        required: true,
      },
      blob_name: {
        type: "string",
        label: "Blob Name",
        required: false,
      },
      connection_string: {
        type: "string",
        label: "Connection String",
        required: true,
      },
    },
  },

  dropbox: {
    type: "dropbox",
    category: "integrations",
    label: "Dropbox",
    description: "Dropbox dosya işlemleri",
    icon: "Cloud",
    color: "bg-blue-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "upload",
        options: [
          { value: "upload", label: "Upload" },
          { value: "download", label: "Download" },
          { value: "list", label: "List Files" },
        ],
      },
      path: {
        type: "string",
        label: "Path",
        required: true,
        placeholder: "/folder/file.txt",
      },
      access_token: {
        type: "string",
        label: "Access Token",
        required: true,
      },
    },
  },

  // ========== PRODUCTIVITY ==========
  notion: {
    type: "notion",
    category: "integrations",
    label: "Notion",
    description: "Notion sayfa ve veritabanı işlemleri",
    icon: "FileText",
    color: "bg-gray-800",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "create_page",
        options: [
          { value: "create_page", label: "Create Page" },
          { value: "update_page", label: "Update Page" },
          { value: "query_database", label: "Query Database" },
        ],
      },
      database_id: {
        type: "string",
        label: "Database ID",
        required: false,
      },
      api_key: {
        type: "string",
        label: "API Key",
        required: true,
      },
    },
  },

  airtable: {
    type: "airtable",
    category: "integrations",
    label: "Airtable",
    description: "Airtable kayıt işlemleri",
    icon: "Table",
    color: "bg-blue-400",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "create",
        options: [
          { value: "create", label: "Create Record" },
          { value: "read", label: "Read Records" },
          { value: "update", label: "Update Record" },
          { value: "delete", label: "Delete Record" },
        ],
      },
      base_id: {
        type: "string",
        label: "Base ID",
        required: true,
      },
      table_name: {
        type: "string",
        label: "Table Name",
        required: true,
      },
      api_key: {
        type: "string",
        label: "API Key",
        required: true,
      },
    },
  },

  trello: {
    type: "trello",
    category: "integrations",
    label: "Trello",
    description: "Trello kart ve liste işlemleri",
    icon: "Grid",
    color: "bg-blue-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "create_card",
        options: [
          { value: "create_card", label: "Create Card" },
          { value: "update_card", label: "Update Card" },
          { value: "list_cards", label: "List Cards" },
        ],
      },
      board_id: {
        type: "string",
        label: "Board ID",
        required: true,
      },
      list_id: {
        type: "string",
        label: "List ID",
        required: false,
      },
      api_key: {
        type: "string",
        label: "API Key",
        required: true,
      },
      token: {
        type: "string",
        label: "Token",
        required: true,
      },
    },
  },

  asana: {
    type: "asana",
    category: "integrations",
    label: "Asana",
    description: "Asana görev yönetimi",
    icon: "CheckSquare",
    color: "bg-purple-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "create_task",
        options: [
          { value: "create_task", label: "Create Task" },
          { value: "update_task", label: "Update Task" },
          { value: "list_tasks", label: "List Tasks" },
        ],
      },
      project_id: {
        type: "string",
        label: "Project ID",
        required: false,
      },
      access_token: {
        type: "string",
        label: "Access Token",
        required: true,
      },
    },
  },

  jira: {
    type: "jira",
    category: "integrations",
    label: "Jira",
    description: "Jira issue yönetimi",
    icon: "Bug",
    color: "bg-blue-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "create_issue",
        options: [
          { value: "create_issue", label: "Create Issue" },
          { value: "update_issue", label: "Update Issue" },
          { value: "search_issues", label: "Search Issues" },
        ],
      },
      project_key: {
        type: "string",
        label: "Project Key",
        required: true,
      },
      domain: {
        type: "string",
        label: "Jira Domain",
        required: true,
        placeholder: "yourcompany.atlassian.net",
      },
      email: {
        type: "string",
        label: "Email",
        required: true,
      },
      api_token: {
        type: "string",
        label: "API Token",
        required: true,
      },
    },
  },

  // ========== E-COMMERCE ==========
  shopify: {
    type: "shopify",
    category: "integrations",
    label: "Shopify",
    description: "Shopify mağaza işlemleri",
    icon: "ShoppingCart",
    color: "bg-green-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "get_products",
        options: [
          { value: "get_products", label: "Get Products" },
          { value: "create_product", label: "Create Product" },
          { value: "get_orders", label: "Get Orders" },
          { value: "update_order", label: "Update Order" },
        ],
      },
      shop_domain: {
        type: "string",
        label: "Shop Domain",
        required: true,
        placeholder: "your-shop.myshopify.com",
      },
      access_token: {
        type: "string",
        label: "Access Token",
        required: true,
      },
    },
  },

  woocommerce: {
    type: "woocommerce",
    category: "integrations",
    label: "WooCommerce",
    description: "WooCommerce mağaza işlemleri",
    icon: "ShoppingBag",
    color: "bg-purple-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "get_products",
        options: [
          { value: "get_products", label: "Get Products" },
          { value: "create_order", label: "Create Order" },
          { value: "get_orders", label: "Get Orders" },
        ],
      },
      store_url: {
        type: "string",
        label: "Store URL",
        required: true,
      },
      consumer_key: {
        type: "string",
        label: "Consumer Key",
        required: true,
      },
      consumer_secret: {
        type: "string",
        label: "Consumer Secret",
        required: true,
      },
    },
  },

  stripe: {
    type: "stripe",
    category: "integrations",
    label: "Stripe",
    description: "Stripe ödeme işlemleri",
    icon: "CreditCard",
    color: "bg-indigo-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "create_payment",
        options: [
          { value: "create_payment", label: "Create Payment" },
          { value: "create_customer", label: "Create Customer" },
          { value: "list_charges", label: "List Charges" },
          { value: "refund", label: "Refund" },
        ],
      },
      api_key: {
        type: "string",
        label: "API Key",
        required: true,
      },
      amount: {
        type: "number",
        label: "Amount (cents)",
        required: false,
      },
      currency: {
        type: "string",
        label: "Currency",
        required: false,
        default: "usd",
      },
    },
  },

  paypal: {
    type: "paypal",
    category: "integrations",
    label: "PayPal",
    description: "PayPal ödeme işlemleri",
    icon: "CreditCard",
    color: "bg-blue-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "create_order",
        options: [
          { value: "create_order", label: "Create Order" },
          { value: "capture_order", label: "Capture Order" },
        ],
      },
      client_id: {
        type: "string",
        label: "Client ID",
        required: true,
      },
      client_secret: {
        type: "string",
        label: "Client Secret",
        required: true,
      },
      mode: {
        type: "select",
        label: "Mode",
        required: true,
        default: "sandbox",
        options: [
          { value: "sandbox", label: "Sandbox" },
          { value: "live", label: "Live" },
        ],
      },
    },
  },

  // ========== SOCIAL MEDIA ==========
  twitter: {
    type: "twitter",
    category: "integrations",
    label: "Twitter / X",
    description: "Twitter/X tweet işlemleri",
    icon: "Twitter",
    color: "bg-black",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "post_tweet",
        options: [
          { value: "post_tweet", label: "Post Tweet" },
          { value: "search_tweets", label: "Search Tweets" },
          { value: "get_user_tweets", label: "Get User Tweets" },
        ],
      },
      text: {
        type: "textarea",
        label: "Tweet Text",
        required: false,
      },
      bearer_token: {
        type: "string",
        label: "Bearer Token",
        required: true,
      },
    },
  },

  facebook: {
    type: "facebook",
    category: "integrations",
    label: "Facebook",
    description: "Facebook post işlemleri",
    icon: "Facebook",
    color: "bg-blue-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "post",
        options: [
          { value: "post", label: "Create Post" },
          { value: "get_posts", label: "Get Posts" },
        ],
      },
      page_id: {
        type: "string",
        label: "Page ID",
        required: true,
      },
      access_token: {
        type: "string",
        label: "Access Token",
        required: true,
      },
    },
  },

  instagram: {
    type: "instagram",
    category: "integrations",
    label: "Instagram",
    description: "Instagram post işlemleri",
    icon: "Instagram",
    color: "bg-pink-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "post_photo",
        options: [
          { value: "post_photo", label: "Post Photo" },
          { value: "get_media", label: "Get Media" },
        ],
      },
      image_url: {
        type: "string",
        label: "Image URL",
        required: false,
      },
      caption: {
        type: "string",
        label: "Caption",
        required: false,
      },
      access_token: {
        type: "string",
        label: "Access Token",
        required: true,
      },
    },
  },

  linkedin: {
    type: "linkedin",
    category: "integrations",
    label: "LinkedIn",
    description: "LinkedIn post işlemleri",
    icon: "Linkedin",
    color: "bg-blue-700",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "post",
        options: [
          { value: "post", label: "Create Post" },
          { value: "get_posts", label: "Get Posts" },
        ],
      },
      text: {
        type: "textarea",
        label: "Post Text",
        required: false,
      },
      access_token: {
        type: "string",
        label: "Access Token",
        required: true,
      },
    },
  },

  youtube: {
    type: "youtube",
    category: "integrations",
    label: "YouTube",
    description: "YouTube video işlemleri",
    icon: "Youtube",
    color: "bg-red-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "search",
        options: [
          { value: "search", label: "Search Videos" },
          { value: "get_video", label: "Get Video Details" },
          { value: "get_comments", label: "Get Comments" },
        ],
      },
      query: {
        type: "string",
        label: "Search Query",
        required: false,
      },
      api_key: {
        type: "string",
        label: "API Key",
        required: true,
      },
    },
  },

  // ========== CRM ==========
  salesforce: {
    type: "salesforce",
    category: "integrations",
    label: "Salesforce",
    description: "Salesforce CRM işlemleri",
    icon: "TrendingUp",
    color: "bg-blue-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "query",
        options: [
          { value: "query", label: "SOQL Query" },
          { value: "create", label: "Create Record" },
          { value: "update", label: "Update Record" },
        ],
      },
      soql: {
        type: "textarea",
        label: "SOQL Query",
        required: false,
        placeholder: "SELECT Id, Name FROM Account",
      },
      instance_url: {
        type: "string",
        label: "Instance URL",
        required: true,
      },
      access_token: {
        type: "string",
        label: "Access Token",
        required: true,
      },
    },
  },

  hubspot: {
    type: "hubspot",
    category: "integrations",
    label: "HubSpot",
    description: "HubSpot CRM işlemleri",
    icon: "TrendingUp",
    color: "bg-orange-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "create_contact",
        options: [
          { value: "create_contact", label: "Create Contact" },
          { value: "update_contact", label: "Update Contact" },
          { value: "get_contact", label: "Get Contact" },
        ],
      },
      api_key: {
        type: "string",
        label: "API Key",
        required: true,
      },
    },
  },

  zoho: {
    type: "zoho",
    category: "integrations",
    label: "Zoho CRM",
    description: "Zoho CRM işlemleri",
    icon: "TrendingUp",
    color: "bg-red-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      action: {
        type: "select",
        label: "Action",
        required: true,
        default: "create_record",
        options: [
          { value: "create_record", label: "Create Record" },
          { value: "update_record", label: "Update Record" },
          { value: "search_records", label: "Search Records" },
        ],
      },
      module: {
        type: "string",
        label: "Module",
        required: true,
        placeholder: "Leads, Contacts, Deals",
      },
      access_token: {
        type: "string",
        label: "Access Token",
        required: true,
      },
    },
  },

  // ========== YENİ DATA & UTILS ==========
  set_variable: {
    type: "set_variable",
    category: "data-utils",
    label: "Set Variable",
    description: "Değişken tanımlama",
    icon: "Variable",
    color: "bg-cyan-600",
    inputs: 1,
    outputs: 1,
    phase: 1,
    configSchema: {
      variable_name: {
        type: "string",
        label: "Variable Name",
        required: true,
        placeholder: "myVar",
      },
      value: {
        type: "string",
        label: "Value",
        required: true,
        placeholder: "{{ context.data }}",
      },
    },
  },

  get_variable: {
    type: "get_variable",
    category: "data-utils",
    label: "Get Variable",
    description: "Değişken okuma",
    icon: "Variable",
    color: "bg-cyan-500",
    inputs: 0,
    outputs: 1,
    phase: 1,
    configSchema: {
      variable_name: {
        type: "string",
        label: "Variable Name",
        required: true,
      },
    },
  },

  json_parse: {
    type: "json_parse",
    category: "data-utils",
    label: "JSON Parse",
    description: "JSON string'i parse eder",
    icon: "Code",
    color: "bg-yellow-500",
    inputs: 1,
    outputs: 1,
    phase: 1,
    configSchema: {
      json_string: {
        type: "string",
        label: "JSON String",
        required: true,
        placeholder: "{{ context.jsonString }}",
      },
    },
  },

  json_stringify: {
    type: "json_stringify",
    category: "data-utils",
    label: "JSON Stringify",
    description: "Obje'yi JSON string'e çevirir",
    icon: "Code",
    color: "bg-yellow-400",
    inputs: 1,
    outputs: 1,
    phase: 1,
    configSchema: {
      pretty: {
        type: "boolean",
        label: "Pretty Print",
        required: false,
        default: false,
      },
    },
  },

  csv_parse: {
    type: "csv_parse",
    category: "data-utils",
    label: "CSV Parse",
    description: "CSV string'i parse eder",
    icon: "FileSpreadsheet",
    color: "bg-green-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      csv_string: {
        type: "string",
        label: "CSV String",
        required: true,
      },
      delimiter: {
        type: "string",
        label: "Delimiter",
        required: false,
        default: ",",
      },
      has_headers: {
        type: "boolean",
        label: "Has Headers",
        required: false,
        default: true,
      },
    },
  },

  csv_generate: {
    type: "csv_generate",
    category: "data-utils",
    label: "CSV Generate",
    description: "Array'den CSV oluşturur",
    icon: "FileSpreadsheet",
    color: "bg-green-400",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      data: {
        type: "array",
        label: "Data Array",
        required: true,
      },
      delimiter: {
        type: "string",
        label: "Delimiter",
        required: false,
        default: ",",
      },
    },
  },

  xml_parse: {
    type: "xml_parse",
    category: "data-utils",
    label: "XML Parse",
    description: "XML string'i parse eder",
    icon: "FileCode",
    color: "bg-orange-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      xml_string: {
        type: "string",
        label: "XML String",
        required: true,
      },
    },
  },

  base64_encode: {
    type: "base64_encode",
    category: "data-utils",
    label: "Base64 Encode",
    description: "String'i Base64'e encode eder",
    icon: "Lock",
    color: "bg-gray-600",
    inputs: 1,
    outputs: 1,
    phase: 1,
    configSchema: {},
  },

  base64_decode: {
    type: "base64_decode",
    category: "data-utils",
    label: "Base64 Decode",
    description: "Base64 string'i decode eder",
    icon: "Unlock",
    color: "bg-gray-500",
    inputs: 1,
    outputs: 1,
    phase: 1,
    configSchema: {},
  },

  hash: {
    type: "hash",
    category: "data-utils",
    label: "Hash",
    description: "String'i hash'ler",
    icon: "Lock",
    color: "bg-gray-700",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      algorithm: {
        type: "select",
        label: "Algorithm",
        required: true,
        default: "sha256",
        options: [
          { value: "md5", label: "MD5" },
          { value: "sha1", label: "SHA1" },
          { value: "sha256", label: "SHA256" },
          { value: "sha512", label: "SHA512" },
        ],
      },
    },
  },

  encrypt: {
    type: "encrypt",
    category: "data-utils",
    label: "Encrypt",
    description: "Veriyi şifreler",
    icon: "Lock",
    color: "bg-red-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      algorithm: {
        type: "select",
        label: "Algorithm",
        required: true,
        default: "aes-256-gcm",
        options: [
          { value: "aes-256-gcm", label: "AES-256-GCM" },
          { value: "aes-128-gcm", label: "AES-128-GCM" },
        ],
      },
      key: {
        type: "string",
        label: "Encryption Key",
        required: true,
      },
    },
  },

  decrypt: {
    type: "decrypt",
    category: "data-utils",
    label: "Decrypt",
    description: "Şifrelenmiş veriyi çözer",
    icon: "Unlock",
    color: "bg-red-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      algorithm: {
        type: "select",
        label: "Algorithm",
        required: true,
        default: "aes-256-gcm",
        options: [
          { value: "aes-256-gcm", label: "AES-256-GCM" },
          { value: "aes-128-gcm", label: "AES-128-GCM" },
        ],
      },
      key: {
        type: "string",
        label: "Decryption Key",
        required: true,
      },
    },
  },

  // ========== YENİ OUTPUTS ==========
  email_send: {
    type: "email_send",
    category: "outputs",
    label: "Send Email",
    description: "E-posta gönderir",
    icon: "Mail",
    color: "bg-blue-500",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      to: {
        type: "string",
        label: "To",
        required: true,
      },
      subject: {
        type: "string",
        label: "Subject",
        required: true,
      },
      body: {
        type: "textarea",
        label: "Body",
        required: true,
      },
      from: {
        type: "string",
        label: "From",
        required: false,
      },
      smtp_server: {
        type: "string",
        label: "SMTP Server",
        required: true,
      },
      smtp_port: {
        type: "number",
        label: "SMTP Port",
        required: false,
        default: 587,
      },
    },
  },

  file_write: {
    type: "file_write",
    category: "outputs",
    label: "Write File",
    description: "Dosyaya yazar",
    icon: "File",
    color: "bg-gray-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      file_path: {
        type: "string",
        label: "File Path",
        required: true,
        placeholder: "/path/to/file.txt",
      },
      content: {
        type: "textarea",
        label: "Content",
        required: true,
      },
      mode: {
        type: "select",
        label: "Mode",
        required: true,
        default: "write",
        options: [
          { value: "write", label: "Write (Overwrite)" },
          { value: "append", label: "Append" },
        ],
      },
    },
  },

  file_download: {
    type: "file_download",
    category: "outputs",
    label: "Download File",
    description: "Dosya indirir",
    icon: "Download",
    color: "bg-blue-600",
    inputs: 1,
    outputs: 1,
    phase: 2,
    configSchema: {
      url: {
        type: "string",
        label: "File URL",
        required: true,
      },
      save_path: {
        type: "string",
        label: "Save Path",
        required: false,
      },
    },
  },
};

// Kategori bilgileri
export const NODE_CATEGORIES: Record<NodeCategory, { label: string; description: string; icon: string }> = {
  triggers: {
    label: "Triggers",
    description: "Tetikleyiciler",
    icon: "Zap",
  },
  "flow-logic": {
    label: "Flow & Logic",
    description: "Akış & Mantık",
    icon: "GitBranch",
  },
  "ai-nodes": {
    label: "AI Nodes",
    description: "Yapay Zeka",
    icon: "Brain",
  },
  integrations: {
    label: "Integrations",
    description: "Entegrasyonlar",
    icon: "Globe",
  },
  "data-utils": {
    label: "Data & Utils",
    description: "Veri & Yardımcılar",
    icon: "Settings",
  },
  outputs: {
    label: "Outputs",
    description: "Çıktı & Kullanıcıya Dönüş",
    icon: "FileOutput",
  },
};

