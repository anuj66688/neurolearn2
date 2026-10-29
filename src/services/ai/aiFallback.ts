// ==========================================
// NeuroLearn Fallback AI Knowledge Engine
// High quality pedagogical fallbacks when offline or no API key is set
// ==========================================

import { QuizQuestion, StudyTask, Recommendation } from '../../types';

export const fallbackExplanations: Record<string, string> = {
  'osi-model': `### Open Systems Interconnection (OSI) Model

The OSI model is a conceptual framework divided into 7 distinct layers:

1. **Application (Layer 7)**: Human-computer interaction (HTTP, DNS, SMTP).
2. **Presentation (Layer 6)**: Data representation, syntax, encryption, and compression (SSL/TLS, JPEG).
3. **Session (Layer 5)**: Interhost communication, session management (Sockets, RPC).
4. **Transport (Layer 4)**: End-to-end connections, reliability, flow control (TCP, UDP).
5. **Network (Layer 3)**: Logical addressing, path determination, and routing (IP, ICMP, BGP).
6. **Data Link (Layer 2)**: Physical addressing, framing, and error detection (MAC, Ethernet, PPP).
7. **Physical (Layer 1)**: Transmission of raw bitstreams over physical media (Cables, Fiber, Radio).

**Mnemonic to remember:** *Please Do Not Throw Sausage Pizza Away* (Layers 1 to 7).`,

  'recursion': `### Understanding Recursion

Recursion is a programming technique where a function solves a problem by calling a smaller instance of itself until reaching a termination condition (base case).

#### Key Components:
1. **Base Case**: The simplest scenario where the answer is known without further calls (prevents infinite recursion and stack overflow).
2. **Recursive Step**: The self-call that reduces the problem size towards the base case.

#### Classic Example (Factorial of n):
\`\`\`python
def factorial(n):
    # 1. Base case
    if n <= 1:
        return 1
    # 2. Recursive step
    return n * factorial(n - 1)
\`\`\`

**Call Stack Visualization for factorial(3):**
- factorial(3) calls 3 * factorial(2)
- factorial(2) calls 2 * factorial(1)
- factorial(1) returns 1 (Base case reached!)
- Unwinds: 2 * 1 = 2 -> 3 * 2 = 6`,

  'tcp-handshake': `### TCP 3-Way Handshake Explained

Transmission Control Protocol (TCP) is connection-oriented. Before exchanging payload data, the client and server establish a reliable synchronized session using 3 packets:

1. **SYN (Synchronize)**:
   - **Client -> Server**: Client picks an initial sequence number $ISN_c$ and sets SYN bit.
2. **SYN-ACK (Synchronize-Acknowledge)**:
   - **Server -> Client**: Server acknowledges receipt by returning $ACK = ISN_c + 1$ and sends its own $ISN_s$.
3. **ACK (Acknowledge)**:
   - **Client -> Server**: Client acknowledges server's sequence number with $ACK = ISN_s + 1$. Connection is now ESTABLISHED!

**Why 3 steps?** Both sides must reliably agree on sequence numbers and verify bidirectional transmit/receive capability before sending critical data.`
};

export const fallbackQuizBank: Record<string, QuizQuestion[]> = {
  'computer-networks': [
    {
      id: 'q-cn-1',
      question: 'Which layer of the OSI model is responsible for end-to-end packet delivery, flow control, and error recovery?',
      options: ['Network Layer', 'Transport Layer', 'Data Link Layer', 'Session Layer'],
      correctOptionIndex: 1,
      explanation: 'The Transport Layer (Layer 4) handles end-to-end communication, segmentation, flow control (TCP windowing), and reliability.',
      topicId: 'cn-transport',
      topicName: 'Transport Layer & TCP',
      difficulty: 'medium'
    },
    {
      id: 'q-cn-2',
      question: 'In IPv4 subnetting, what is the default subnet mask for a Class C network?',
      options: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'],
      correctOptionIndex: 2,
      explanation: 'Class C networks use a 24-bit network prefix (/24), which corresponds to 255.255.255.0 with 254 usable host addresses.',
      topicId: 'cn-subnetting',
      topicName: 'IP Addressing & Subnetting',
      difficulty: 'easy'
    },
    {
      id: 'q-cn-3',
      question: 'Why does TCP use a Three-Way Handshake instead of a Two-Way Handshake?',
      options: [
        'To negotiate encryption keys',
        'To prevent old duplicate connection requests from causing false session establishment',
        'To measure network bandwidth latency',
        'Because routers drop 2-way requests'
      ],
      correctOptionIndex: 1,
      explanation: 'A two-way handshake leaves the server uncertain whether an initial SYN was delayed or fresh; 3-way ensures both parties verify mutual round-trip sequence agreement.',
      topicId: 'cn-tcp',
      topicName: 'TCP & Reliable Data Transfer',
      difficulty: 'hard'
    }
  ],
  'data-structures': [
    {
      id: 'q-ds-1',
      question: 'What is the worst-case time complexity of searching an element in an unbalanced Binary Search Tree (BST)?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctOptionIndex: 2,
      explanation: 'When a BST degenerates into a linked-list structure (skewed tree), lookup time degrades to linear O(n). Self-balancing trees (AVL/Red-Black) guarantee O(log n).',
      topicId: 'ds-trees',
      topicName: 'Binary Search Trees',
      difficulty: 'medium'
    },
    {
      id: 'q-ds-2',
      question: 'Which data structure is fundamentally utilized to implement Breadth-First Search (BFS) in a graph?',
      options: ['Stack', 'Queue', 'Priority Queue', 'Hash Table'],
      correctOptionIndex: 1,
      explanation: 'BFS explores vertices level by level, requiring First-In-First-Out (FIFO) ordering provided by a Queue.',
      topicId: 'ds-graphs',
      topicName: 'Graph Traversals',
      difficulty: 'easy'
    }
  ]
};

export const fallbackTasks: StudyTask[] = [
  {
    id: 'task-fb-1',
    title: 'Review IP Addressing & Subnetting Formulas',
    subjectId: 'sub-cn',
    subjectName: 'Computer Networks',
    topicId: 'cn-subnetting',
    topicName: 'Subnetting & CIDR',
    durationMinutes: 40,
    priority: 'high',
    status: 'pending',
    scheduledDate: new Date().toISOString().split('T')[0],
    adaptiveReason: 'Identified as a weak topic (score below 60%) from recent assessment'
  },
  {
    id: 'task-fb-2',
    title: 'Solve 5 Tree Traversal Coding Problems',
    subjectId: 'sub-ds',
    subjectName: 'Data Structures',
    topicId: 'ds-trees',
    topicName: 'Binary Trees & Traversals',
    durationMinutes: 45,
    priority: 'medium',
    status: 'pending',
    scheduledDate: new Date().toISOString().split('T')[0],
    adaptiveReason: 'Scheduled to reinforce recursive intuition based on student profile'
  }
];

export const fallbackRecommendations: Recommendation[] = [
  {
    id: 'rec-fb-1',
    studentId: 'demo-student-1',
    subjectId: 'sub-cn',
    subjectName: 'Computer Networks',
    topicId: 'cn-subnetting',
    topicName: 'Subnetting & CIDR',
    resourceType: 'ai_explanation',
    title: 'Step-by-Step CIDR Subnetting Guide',
    description: 'Your quiz accuracy in Subnetting was 40%. Master the binary power-of-2 method with interactive visual examples.',
    durationMinutes: 15,
    priority: 'urgent',
    triggerReason: 'Quiz accuracy below 50% in Computer Networks assessment',
    isCompleted: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'rec-fb-2',
    studentId: 'demo-student-1',
    subjectId: 'sub-ds',
    subjectName: 'Data Structures',
    topicId: 'ds-graphs',
    topicName: 'Graph Traversals (BFS & DFS)',
    resourceType: 'practice_problem',
    title: 'BFS vs DFS Implementation Matrix',
    description: 'Compare queue-based iterative BFS with call-stack recursive DFS using interactive memory tracing.',
    durationMinutes: 25,
    priority: 'high',
    triggerReason: 'Study Planner agent identified readiness for advanced graph algorithms',
    isCompleted: false,
    createdAt: new Date().toISOString()
  }
];
