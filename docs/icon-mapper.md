# Smart Icon Mapper Documentation

## Overview
The **Smart Icon Mapper** (`utils/iconMapper.tsx`) is a utility responsible for automatically selecting the most appropriate icon for a diagram node based on its label, type, and description. It prioritizes user-uploaded **Custom Icons** using an advanced **Token-Based Scoring System** before falling back to a hardcoded set of built-in React Icons.

## Workflow
1.  **Input**: Node Label (e.g., "AWS Lambda Service"), Node Type, Description, and the list of available Custom Icons.
2.  **Custom Icon Check**: The system runs the **Scoring Algorithm** to find a matching custom icon.
3.  **Fallback**: If no custom icon matches (score < threshold), it checks the **Built-in Rules** (React Icons).
4.  **Default**: If no match is found, it returns a generic icon based on the node type (e.g., `FaServer` for services).

---

## 1. Custom Icon Matching (The "Smart" Logic)

The core of the system is the **Token-Based Scoring Algorithm**. This allows for fuzzy matching that is robust against multi-word labels, capitalization differences, and generic terms.

### A. Normalization & Tokenization
Before comparing, both the Node Label and the Icon Filename are processed:
1.  **Normalization**: Converted to lowercase. Special characters (`-`, `_`, `.`) are replaced with spaces.
2.  **Tokenization**: Split into individual words (tokens).
3.  **Stop Word Removal**: Generic words that cause false positives are removed.

**Stop Words List**:
> `service`, `server`, `app`, `application`, `component`, `node`, `system`, `database`, `db`, `icon`, 'logo', `v1`, `v2`, `v3`

**Example**:
*   **Node Label**: "AWS Lambda Service"
    *   *Normalized*: "aws lambda service"
    *   *Tokens*: `["aws", "lambda", "service"]`
    *   *Filtered*: `["aws", "lambda"]` (Removed "service")
*   **Icon Filename**: `custom_aws_lambda_v2.svg`
    *   *Normalized*: "aws lambda v2"
    *   *Tokens*: `["aws", "lambda", "v2"]`
    *   *Filtered*: `["aws", "lambda"]` (Removed "v2")

### B. Scoring Algorithm
The system calculates a **Match Score** by comparing the tokens of the label against the tokens of the icon name.

| Match Type | Points | Description |
| :--- | :--- | :--- |
| **Exact Token Match** | **+10** | The word appears exactly in both (e.g., "redis" == "redis"). |
| **Partial Token Match** | **+3** | One word contains the other (e.g., "mongo" inside "mongodb"). |
| **Exact Phrase Bonus** | **+5** | The full normalized string matches exactly. |

### C. Selection Threshold
*   **Threshold**: A match is only accepted if the total score is **> 5**. This prevents weak matches (like a single partial match) from triggering.
*   **Best Match**: The icon with the highest score is selected.

### D. Examples

#### Scenario 1: Strong Match
*   **Label**: "AWS Lambda Service" -> `["aws", "lambda"]`
*   **Icon**: `custom_aws_lambda.svg` -> `["aws", "lambda"]`
*   **Scoring**:
    *   "aws" == "aws" (+10)
    *   "lambda" == "lambda" (+10)
    *   **Total: 20**
*   **Result**: **MATCH** (Score > 5)

#### Scenario 2: False Positive Prevention
*   **Label**: "User Service" -> `["user"]` (Service is a stop word)
*   **Icon**: `custom_auth_service.svg` -> `["auth"]` (Service is a stop word)
*   **Scoring**:
    *   "user" vs "auth" -> No match.
    *   **Total: 0**
*   **Result**: **NO MATCH** (Correctly avoids using Auth icon for User service)

---

## 2. Built-in Icon Matching (Fallback)

If no custom icon is found, the system checks a hardcoded list of rules to return a standard React Icon (from `react-icons`).

### Logic
It performs simple substring checks on the normalized label.

```typescript
// Example Logic
if (text.includes('aws') || text.includes('amazon')) return <SiAmazon />;
if (text.includes('redis')) return <SiRedis />;
if (text.includes('postgres')) return <SiPostgresql />;
```

### Categories
The built-in icons are organized into categories:
1.  **Cloud Providers** (AWS, Azure, GCP)
2.  **Infrastructure & DevOps** (Kubernetes, Docker, Nginx)
3.  **Databases** (Redis, Postgres, Mongo)
4.  **Backend & Languages** (Node, Python, Go, Java)
5.  **Frontend & Mobile** (React, Vue, Flutter)
6.  **Messaging** (Kafka, RabbitMQ)
7.  **SaaS** (Stripe, Auth0)

---

## 3. Generic Fallbacks

If neither a custom icon nor a specific built-in icon is found, the system assigns a generic icon based on the **Node Type**:

*   `database` -> `FaDatabase`
*   `client` -> `FaLaptopCode` (or `FaMobileAlt` if "mobile" is in text)
*   `queue` -> `MdQueue`
*   `service` -> `FaServer` (or `MdApi` if "api" is in text)
*   `group` -> `FaCloud`
