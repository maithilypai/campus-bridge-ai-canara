// Academic Data for CAMPUS BRIDGE AI - Canara Engineering College (VTU)
// VTU 2021/2022 Scheme AIML Curriculum Outline

export const academicResources = [
  // 1ST YEAR AIML
  {
    id: "res-101",
    year: 1,
    yearLabel: "1st Year AIML",
    semester: 1,
    subjectName: "Mathematics-I for CSE & AIML Stream",
    subjectCode: "22MATS11",
    credits: 4,
    category: "Math / Allied",
    description: "Calculus, Differential Equations, Linear Algebra, and Eigenvalue problems prescribed under VTU 2022 Scheme for computer science and AI foundation.",
    syllabus: [
      { module: "Module 1", title: "Calculus & Polar Curves", hours: 8, weightage: 20 },
      { module: "Module 2", title: "Series Expansion & Multivariable Calculus", hours: 8, weightage: 20 },
      { module: "Module 3", title: "Ordinary Differential Equations of First Order", hours: 8, weightage: 20 },
      { module: "Module 4", title: "Linear Algebra & Rank of Matrix", hours: 9, weightage: 20 },
      { module: "Module 5", title: "Eigenvalues, Eigenvectors & Diagonalization", hours: 7, weightage: 20 }
    ],
    notes: [
      { id: "n1", title: "Module 1 & 2 Formula & Theorem Reference", source: "VTU 2022 Scheme Syllabus Guide", pages: 28, type: "Curriculum Reference" },
      { id: "n2", title: "Module 4 & 5 Linear Algebra & Matrix Guide", source: "VTU Mathematics Curriculum", pages: 42, type: "Curriculum Reference" }
    ],
    pyqs: [
      { year: "2024 Exam", exam: "VTU Examination Specimen Paper", solved: true, format: "Reference Format" },
      { year: "2023 Exam", exam: "VTU Examination Paper Outline", solved: true, format: "Reference Format" }
    ],
    labs: [
      { title: "Mathematical Computing Computational Exercises", format: "SciPy/Python Guidelines", status: "VTU Lab Outline" }
    ]
  },
  {
    id: "res-102",
    year: 1,
    yearLabel: "1st Year AIML",
    semester: 1,
    subjectName: "Principles of Programming using C",
    subjectCode: "22POP12",
    credits: 3,
    category: "Core Theory",
    description: "Structured programming fundamentals, conditional statements, loops, arrays, strings, functions, pointers, and file operations under VTU syllabus.",
    syllabus: [
      { module: "Module 1", title: "Introduction to Computing & Flowcharts", hours: 8, weightage: 20 },
      { module: "Module 2", title: "Control Structures: Branching & Looping", hours: 8, weightage: 20 },
      { module: "Module 3", title: "Arrays & String Handling", hours: 8, weightage: 20 },
      { module: "Module 4", title: "Modular Programming with Functions & Recursion", hours: 8, weightage: 20 },
      { module: "Module 5", title: "Pointers, Structures & Basic File Handling", hours: 8, weightage: 20 }
    ],
    notes: [
      { id: "n3", title: "Modules 1-5 Structured Programming Primer", source: "VTU Curriculum Guide", pages: 64, type: "Curriculum Reference" },
      { id: "n4", title: "Pointers & Memory Allocation Reference", source: "VTU Curriculum Guide", pages: 22, type: "Curriculum Reference" }
    ],
    pyqs: [
      { year: "2024 Exam", exam: "VTU Regular Examination Paper", solved: true, format: "Reference Format" },
      { year: "2023 Exam", exam: "VTU Model Examination Paper", solved: true, format: "Reference Format" }
    ],
    labs: [
      { title: "VTU 22POPL17 Programming in C Lab Problem Statements", format: "14 Prescribed Exercises", status: "VTU Syllabus" }
    ]
  },
  {
    id: "res-103",
    year: 1,
    yearLabel: "1st Year AIML",
    semester: 2,
    subjectName: "Applied Physics for CSE & AIML",
    subjectCode: "22PHYS12",
    credits: 4,
    category: "Math / Allied",
    description: "Quantum mechanics fundamentals, lasers, optical fibers, semiconductors, and electronic materials for modern computing.",
    syllabus: [
      { module: "Module 1", title: "Quantum Mechanics & Wave Functions", hours: 8, weightage: 20 },
      { module: "Module 2", title: "Lasers & Fiber Optics Communication", hours: 8, weightage: 20 },
      { module: "Module 3", title: "Semiconductor Physics & Dielectrics", hours: 8, weightage: 20 },
      { module: "Module 4", title: "Superconductivity & Quantum Dots", hours: 8, weightage: 20 },
      { module: "Module 5", title: "Nanomaterials in Modern Electronics", hours: 8, weightage: 20 }
    ],
    notes: [
      { id: "n5", title: "Quantum Physics & Laser Communication Handout", source: "VTU Physics Curriculum", pages: 52, type: "Curriculum Reference" }
    ],
    pyqs: [
      { year: "2023 Exam", exam: "VTU Examination Specimen Paper", solved: true, format: "Reference Format" }
    ],
    labs: [
      { title: "Applied Physics Experimental Guidelines & Plots", format: "VTU Lab Outline", status: "VTU Syllabus" }
    ]
  },

  // 2ND YEAR AIML
  {
    id: "res-201",
    year: 2,
    yearLabel: "2nd Year AIML",
    semester: 3,
    subjectName: "Data Structures and Applications",
    subjectCode: "21CS32",
    credits: 4,
    category: "Core Theory",
    description: "Linear and non-linear data structures: Stacks, Queues, Linked Lists, Binary Trees, AVL Trees, Graphs, and Hash Tables under VTU 2021 Scheme.",
    syllabus: [
      { module: "Module 1", title: "Arrays, Structures, Dynamic Memory & Stacks", hours: 10, weightage: 20 },
      { module: "Module 2", title: "Queues: Circular, Priority & Double-Ended", hours: 8, weightage: 20 },
      { module: "Module 3", title: "Linked Lists: Singly, Doubly & Circular Lists", hours: 10, weightage: 20 },
      { module: "Module 4", title: "Trees: Binary Trees, BST, AVL Trees & Heaps", hours: 10, weightage: 20 },
      { module: "Module 5", title: "Graphs, Hashing & File Organization", hours: 10, weightage: 20 }
    ],
    notes: [
      { id: "n6", title: "Modules 1-5 DSA Concepts Reference", source: "VTU CS/AIML Curriculum Outline", pages: 98, type: "Curriculum Reference" },
      { id: "n7", title: "Tree & Graph Traversals Summary", source: "VTU Curriculum Reference", pages: 30, type: "Curriculum Reference" }
    ],
    pyqs: [
      { year: "2024 Exam", exam: "VTU 21CS32 Semester Examination Paper", solved: true, format: "Reference Format" },
      { year: "2023 Exam", exam: "VTU 21CS32 Model Examination Paper", solved: true, format: "Reference Format" }
    ],
    labs: [
      { title: "VTU 21CSL35 Data Structures Laboratory Problem Specifications", format: "12 Prescribed Programs", status: "VTU Syllabus" }
    ]
  },
  {
    id: "res-202",
    year: 2,
    yearLabel: "2nd Year AIML",
    semester: 3,
    subjectName: "Object Oriented Programming with Java",
    subjectCode: "21CS35",
    credits: 3,
    category: "Core Theory",
    description: "Object-oriented design, classes, inheritance, polymorphism, interfaces, exception handling, multithreading, and Java Collections.",
    syllabus: [
      { module: "Module 1", title: "Java Fundamentals & Class Design", hours: 8, weightage: 20 },
      { module: "Module 2", title: "Inheritance, Polymorphism & Interfaces", hours: 8, weightage: 20 },
      { module: "Module 3", title: "Packages & Exception Handling", hours: 8, weightage: 20 },
      { module: "Module 4", title: "Multithreaded Programming & Synchronization", hours: 8, weightage: 20 },
      { module: "Module 5", title: "Generics, Java Collections & Lambda Expressions", hours: 8, weightage: 20 }
    ],
    notes: [
      { id: "n8", title: "Java OOP Curriculum Reference Notes", source: "VTU 2021 Scheme Outline", pages: 74, type: "Curriculum Reference" }
    ],
    pyqs: [
      { year: "2024 Exam", exam: "VTU 21CS35 Examination Paper", solved: true, format: "Reference Format" }
    ],
    labs: [
      { title: "Java OOP Practical Exercises & Problem Statements", format: "VTU Lab Outline", status: "VTU Syllabus" }
    ]
  },
  {
    id: "res-203",
    year: 2,
    yearLabel: "2nd Year AIML",
    semester: 4,
    subjectName: "Design & Analysis of Algorithms",
    subjectCode: "21CS42",
    credits: 4,
    category: "Core Theory",
    description: "Asymptotic notation, divide and conquer, greedy techniques, dynamic programming, decrease and conquer, backtracking, branch & bound, and NP-completeness.",
    syllabus: [
      { module: "Module 1", title: "Time Complexity & Divide-and-Conquer", hours: 10, weightage: 20 },
      { module: "Module 2", title: "Greedy Technique & Minimum Spanning Trees", hours: 10, weightage: 20 },
      { module: "Module 3", title: "Dynamic Programming (Knapsack, LCS, Warshall)", hours: 10, weightage: 20 },
      { module: "Module 4", title: "Decrease-and-Conquer & Backtracking (N-Queens)", hours: 8, weightage: 20 },
      { module: "Module 5", title: "Branch & Bound & Introduction to NP-Completeness", hours: 8, weightage: 20 }
    ],
    notes: [
      { id: "n9", title: "DAA Complete Algorithm Design Reference", source: "VTU Syllabus Guide", pages: 110, type: "Curriculum Reference" }
    ],
    pyqs: [
      { year: "2024 Exam", exam: "VTU 21CS42 Examination Paper", solved: true, format: "Reference Format" }
    ],
    labs: [
      { title: "VTU 21CSL46 DAA Lab Exercises & Algorithms Specification", format: "VTU Lab Guidelines", status: "VTU Syllabus" }
    ]
  },
  {
    id: "res-204",
    year: 2,
    yearLabel: "2nd Year AIML",
    semester: 4,
    subjectName: "Operating Systems",
    subjectCode: "21CS43",
    credits: 3,
    category: "Core Theory",
    description: "Process management, CPU scheduling, thread synchronization, deadlocks, virtual memory management, and file system architecture.",
    syllabus: [
      { module: "Module 1", title: "OS Structures & Process Concept", hours: 8, weightage: 20 },
      { module: "Module 2", title: "CPU Scheduling & Synchronization", hours: 8, weightage: 20 },
      { module: "Module 3", title: "Deadlocks: Prevention & Avoidance (Banker's)", hours: 8, weightage: 20 },
      { module: "Module 4", title: "Main Memory & Virtual Memory Paging", hours: 8, weightage: 20 },
      { module: "Module 5", title: "Secondary Storage & File System Implementation", hours: 8, weightage: 20 }
    ],
    notes: [
      { id: "n10", title: "Operating Systems Core Concepts Reference", source: "VTU Syllabus Reference", pages: 85, type: "Curriculum Reference" }
    ],
    pyqs: [
      { year: "2024 Exam", exam: "VTU 21CS43 Examination Paper", solved: true, format: "Reference Format" }
    ],
    labs: [
      { title: "POSIX Threads & Process Scheduling Exercises", format: "VTU Lab Outline", status: "VTU Syllabus" }
    ]
  },

  // 3RD YEAR AIML
  {
    id: "res-301",
    year: 3,
    yearLabel: "3rd Year AIML",
    semester: 5,
    subjectName: "Artificial Intelligence",
    subjectCode: "21AI51",
    credits: 3,
    category: "Core Theory",
    description: "State-space search (A*, IDA*, minimax), knowledge representation, first-order logic, planning, probabilistic reasoning, and Bayesian networks.",
    syllabus: [
      { module: "Module 1", title: "AI Problem Formulation & State Space Search", hours: 8, weightage: 20 },
      { module: "Module 2", title: "Heuristic Search: A*, Greedy Best First, Minimax", hours: 8, weightage: 20 },
      { module: "Module 3", title: "Knowledge Representation & First-Order Predicate Logic", hours: 8, weightage: 20 },
      { module: "Module 4", title: "Classical Planning & Constraint Satisfaction", hours: 8, weightage: 20 },
      { module: "Module 5", title: "Probabilistic Reasoning & Bayesian Belief Networks", hours: 8, weightage: 20 }
    ],
    notes: [
      { id: "n11", title: "Russell & Norvig AI Syllabus Topics Guide", source: "VTU AIML Curriculum Reference", pages: 92, type: "Curriculum Reference" }
    ],
    pyqs: [
      { year: "2024 Exam", exam: "VTU 21AI51 Examination Paper", solved: true, format: "Reference Format" },
      { year: "2023 Exam", exam: "VTU 21AI51 Model Question Paper", solved: true, format: "Reference Format" }
    ],
    labs: [
      { title: "AI Heuristic Search Exercises (A*, Minimax)", format: "Python Problem Statements", status: "VTU Syllabus" }
    ]
  },
  {
    id: "res-302",
    year: 3,
    yearLabel: "3rd Year AIML",
    semester: 5,
    subjectName: "Database Management Systems",
    subjectCode: "21CS52",
    credits: 3,
    category: "Core Theory",
    description: "Entity-Relationship model, relational algebra, SQL DDL/DML, functional dependencies, normalization (1NF to BCNF), and ACID transactions.",
    syllabus: [
      { module: "Module 1", title: "DBMS Architecture & ER Modeling", hours: 8, weightage: 20 },
      { module: "Module 2", title: "Relational Data Model & Relational Algebra", hours: 8, weightage: 20 },
      { module: "Module 3", title: "SQL: Complex Queries, Triggers & Views", hours: 8, weightage: 20 },
      { module: "Module 4", title: "Database Design Theory & Normalization (1NF to BCNF)", hours: 8, weightage: 20 },
      { module: "Module 5", title: "Transaction Processing, Concurrency & Recovery", hours: 8, weightage: 20 }
    ],
    notes: [
      { id: "n13", title: "Relational Databases & SQL Reference", source: "VTU Syllabus Guide", pages: 88, type: "Curriculum Reference" }
    ],
    pyqs: [
      { year: "2024 Exam", exam: "VTU 21CS52 Examination Paper", solved: true, format: "Reference Format" }
    ],
    labs: [
      { title: "VTU 21CSL55 Database Lab Exercises & Schema Guidelines", format: "SQL Specification", status: "VTU Syllabus" }
    ]
  },
  {
    id: "res-303",
    year: 3,
    yearLabel: "3rd Year AIML",
    semester: 5,
    subjectName: "Machine Learning",
    subjectCode: "21AI54",
    credits: 4,
    category: "Core Theory",
    description: "Supervised and unsupervised learning, decision trees, neural backpropagation, Bayesian learning, SVMs, k-means clustering, PCA, and ensemble learning.",
    syllabus: [
      { module: "Module 1", title: "Concept Learning & Decision Tree Learning", hours: 10, weightage: 20 },
      { module: "Module 2", title: "Artificial Neural Networks & Backpropagation", hours: 10, weightage: 20 },
      { module: "Module 3", title: "Bayesian Learning, Naive Bayes & EM Algorithm", hours: 10, weightage: 20 },
      { module: "Module 4", title: "Support Vector Machines & Instance-Based Learning", hours: 10, weightage: 20 },
      { module: "Module 5", title: "Clustering (k-Means), PCA & Ensemble Boosting", hours: 10, weightage: 20 }
    ],
    notes: [
      { id: "n14", title: "Machine Learning Concepts & Formula Guide", source: "VTU AIML Curriculum Reference", pages: 112, type: "Curriculum Reference" }
    ],
    pyqs: [
      { year: "2024 Exam", exam: "VTU 21AI54 Examination Paper", solved: true, format: "Reference Format" },
      { year: "2023 Exam", exam: "VTU 21AI54 Model Question Paper", solved: true, format: "Reference Format" }
    ],
    labs: [
      { title: "VTU 21AIL57 Machine Learning Lab Experiment List", format: "Scikit-Learn Problem Specifications", status: "VTU Syllabus" }
    ]
  },
  {
    id: "res-304",
    year: 3,
    yearLabel: "3rd Year AIML",
    semester: 6,
    subjectName: "Deep Learning & Neural Networks",
    subjectCode: "21AI62",
    credits: 4,
    category: "Core Theory",
    description: "Deep feedforward networks, optimization (SGD, Adam), Convolutional Neural Networks (CNN), Recurrent Neural Networks (RNN/LSTM), and autoencoders.",
    syllabus: [
      { module: "Module 1", title: "Deep Forward Networks, Loss Functions & Regularization", hours: 10, weightage: 20 },
      { module: "Module 2", title: "Optimization for Training Deep Models (SGD, Adam)", hours: 10, weightage: 20 },
      { module: "Module 3", title: "Convolutional Neural Networks: Convolutions & Pooling", hours: 10, weightage: 20 },
      { module: "Module 4", title: "Sequence Modeling: RNN, LSTM, GRU & Attention", hours: 10, weightage: 20 },
      { module: "Module 5", title: "Autoencoders & Deep Generative Models Introduction", hours: 10, weightage: 20 }
    ],
    notes: [
      { id: "n16", title: "Deep Learning Foundations & Architectures Reference", source: "VTU AIML Curriculum Guide", pages: 125, type: "Curriculum Reference" }
    ],
    pyqs: [
      { year: "2024 Exam", exam: "VTU 21AI62 Model Examination Paper", solved: true, format: "Reference Format" }
    ],
    labs: [
      { title: "Deep Learning Experiments (CNN, RNN Implementations)", format: "PyTorch/TensorFlow Guidelines", status: "VTU Syllabus" }
    ]
  },
  {
    id: "res-305",
    year: 3,
    yearLabel: "3rd Year AIML",
    semester: 6,
    subjectName: "Natural Language Processing",
    subjectCode: "21AI63",
    credits: 3,
    category: "Professional Elective",
    description: "Tokenization, n-grams, POS tagging, word embeddings (Word2Vec, GloVe), Transformer models, and sequence-to-sequence translation.",
    syllabus: [
      { module: "Module 1", title: "Text Preprocessing, Tokenization & Morphology", hours: 8, weightage: 20 },
      { module: "Module 2", title: "Language Models & N-gram Probabilistic Estimations", hours: 8, weightage: 20 },
      { module: "Module 3", title: "Part-of-Speech Tagging & Syntactic Parsing", hours: 8, weightage: 20 },
      { module: "Module 4", title: "Distributed Representations & Word Embeddings", hours: 8, weightage: 20 },
      { module: "Module 5", title: "Transformers, BERT Architecture & Sentiment Analysis", hours: 8, weightage: 20 }
    ],
    notes: [
      { id: "n18", title: "NLP Module 1-5 Curriculum Topics Guide", source: "VTU AIML Curriculum Guide", pages: 84, type: "Curriculum Reference" }
    ],
    pyqs: [
      { year: "2024 Exam", exam: "VTU 21AI63 Examination Paper", solved: true, format: "Reference Format" }
    ],
    labs: [
      { title: "NLP Text Classification & Tokenization Lab Guidelines", format: "NLTK/Transformers Problem List", status: "VTU Syllabus" }
    ]
  },

  // 4TH YEAR AIML
  {
    id: "res-401",
    year: 4,
    yearLabel: "4th Year AIML",
    semester: 7,
    subjectName: "Computer Vision & Robotics",
    subjectCode: "21AI71",
    credits: 4,
    category: "Core Theory",
    description: "Image formation, feature extraction (SIFT, ORB), object detection (YOLO, SSD), semantic segmentation, and robotic vision fundamentals.",
    syllabus: [
      { module: "Module 1", title: "Image Formation, Filtering & Edge Detection", hours: 10, weightage: 20 },
      { module: "Module 2", title: "Feature Detection, Description & Matching (SIFT)", hours: 10, weightage: 20 },
      { module: "Module 3", title: "Modern Object Detection Architectures (YOLO)", hours: 10, weightage: 20 },
      { module: "Module 4", title: "Image Segmentation & 3D Stereo Reconstruction", hours: 10, weightage: 20 },
      { module: "Module 5", title: "Robotic Vision, Visual Odometry & SLAM Intro", hours: 10, weightage: 20 }
    ],
    notes: [
      { id: "n19", title: "Computer Vision Curriculum Summary Guide", source: "VTU AIML Curriculum Reference", pages: 118, type: "Curriculum Reference" }
    ],
    pyqs: [
      { year: "2024 Exam", exam: "VTU 21AI71 Examination Paper", solved: true, format: "Reference Format" }
    ],
    labs: [
      { title: "OpenCV Computer Vision Problem Statements", format: "Python Vision Exercises", status: "VTU Syllabus" }
    ]
  },
  {
    id: "res-402",
    year: 4,
    yearLabel: "4th Year AIML",
    semester: 7,
    subjectName: "Big Data Analytics & Cloud MLOps",
    subjectCode: "21AI72",
    credits: 3,
    category: "Core Theory",
    description: "Hadoop ecosystem, Apache Spark, distributed ML with MLlib, model deployment, containerization with Docker, and MLflow monitoring.",
    syllabus: [
      { module: "Module 1", title: "Big Data Architecture & Hadoop HDFS/MapReduce", hours: 8, weightage: 20 },
      { module: "Module 2", title: "Apache Spark RDDs & DataFrames for AI Analytics", hours: 8, weightage: 20 },
      { module: "Module 3", title: "Distributed Machine Learning using Spark MLlib", hours: 8, weightage: 20 },
      { module: "Module 4", title: "Containerization with Docker & Kubernetes for ML", hours: 8, weightage: 20 },
      { module: "Module 5", title: "MLOps: CI/CD Pipelines & Model Serving", hours: 8, weightage: 20 }
    ],
    notes: [
      { id: "n20", title: "Spark & MLOps Architecture Reference", source: "VTU Curriculum Guide", pages: 76, type: "Curriculum Reference" }
    ],
    pyqs: [
      { year: "2024 Exam", exam: "VTU 21AI72 Examination Paper", solved: true, format: "Reference Format" }
    ],
    labs: [
      { title: "PySpark & Containerization Lab Problem Statements", format: "Distributed Systems Exercises", status: "VTU Syllabus" }
    ]
  },
  {
    id: "res-403",
    year: 4,
    yearLabel: "4th Year AIML",
    semester: 8,
    subjectName: "Generative AI & Large Language Models",
    subjectCode: "21AI742",
    credits: 3,
    category: "Professional Elective",
    description: "Diffusion models, Generative Adversarial Networks (GANs), Transformer decoder architectures (GPT), Prompt Engineering, Fine-Tuning, and RAG.",
    syllabus: [
      { module: "Module 1", title: "Foundations of Generative Modeling & VAEs", hours: 8, weightage: 20 },
      { module: "Module 2", title: "Diffusion Models & Latent Diffusion Architecture", hours: 8, weightage: 20 },
      { module: "Module 3", title: "Large Language Models & Self-Attention Mechanics", hours: 8, weightage: 20 },
      { module: "Module 4", title: "Parameter-Efficient Fine-Tuning: LoRA & QLoRA", hours: 8, weightage: 20 },
      { module: "Module 5", title: "Retrieval Augmented Generation (RAG) & Vector DBs", hours: 8, weightage: 20 }
    ],
    notes: [
      { id: "n21", title: "Generative AI & LLM Curriculum Guide", source: "VTU Emerging Tech Reference", pages: 104, type: "Curriculum Reference" }
    ],
    pyqs: [
      { year: "2024 Exam", exam: "VTU 21AI742 Emerging Tech Specimen Paper", solved: true, format: "Reference Format" }
    ],
    labs: [
      { title: "Building RAG Pipeline Hands-on Exercise Specifications", format: "Python/Vector DB Outline", status: "VTU Syllabus" }
    ]
  }
];

// Presets for the SGPA calculator (VTU Official Curriculum Credit Breakdown)
export const vtuSemesterPresets = {
  "3rd Sem AIML": [
    { id: 1, name: "Transform Calculus, Fourier Series & Numerical Tech (21MATCS31)", credits: 3, grade: "A+" },
    { id: 2, name: "Data Structures and Applications (21CS32)", credits: 4, grade: "A+" },
    { id: 3, name: "Analog and Digital Electronics (21CS33)", credits: 3, grade: "A" },
    { id: 4, name: "Computer Organization and Architecture (21CS34)", credits: 3, grade: "A" },
    { id: 5, name: "Object Oriented Programming with Java (21CS35)", credits: 3, grade: "O" },
    { id: 6, name: "Data Structures Laboratory (21CSL36)", credits: 1.5, grade: "O" },
    { id: 7, name: "Analog and Digital Electronics Lab (21CSL37)", credits: 1.5, grade: "A+" },
    { id: 8, name: "Constitution of India & Prof Ethics (21CIP39)", credits: 1, grade: "O" }
  ],
  "4th Sem AIML": [
    { id: 1, name: "Mathematical Foundations for Computing (21MATCS41)", credits: 3, grade: "A+" },
    { id: 2, name: "Design and Analysis of Algorithms (21CS42)", credits: 4, grade: "O" },
    { id: 3, name: "Operating Systems (21CS43)", credits: 3, grade: "A+" },
    { id: 4, name: "Python for Data Science (21AI44)", credits: 3, grade: "O" },
    { id: 5, name: "Design & Analysis of Algorithms Lab (21CSL46)", credits: 1.5, grade: "O" },
    { id: 6, name: "Python for Data Science Lab (21AIL47)", credits: 1.5, grade: "O" },
    { id: 7, name: "Universal Human Values (21UHV49)", credits: 1, grade: "A+" }
  ],
  "5th Sem AIML": [
    { id: 1, name: "Artificial Intelligence (21AI51)", credits: 3, grade: "A+" },
    { id: 2, name: "Database Management Systems (21CS52)", credits: 3, grade: "A+" },
    { id: 3, name: "Computer Networks (21CS53)", credits: 3, grade: "A" },
    { id: 4, name: "Machine Learning (21AI54)", credits: 4, grade: "O" },
    { id: 5, name: "Research Methodology & IPR (21RMI56)", credits: 2, grade: "A+" },
    { id: 6, name: "DBMS Laboratory with Mini Project (21CSL55)", credits: 1.5, grade: "O" },
    { id: 7, name: "Machine Learning Lab (21AIL57)", credits: 1.5, grade: "O" },
    { id: 8, name: "Environmental Studies (21CIV59)", credits: 1, grade: "O" }
  ],
  "6th Sem AIML": [
    { id: 1, name: "Automata Theory & Compiler Design (21AI61)", credits: 3, grade: "A+" },
    { id: 2, name: "Deep Learning & Neural Networks (21AI62)", credits: 4, grade: "O" },
    { id: 3, name: "Natural Language Processing (21AI63)", credits: 3, grade: "A+" },
    { id: 4, name: "Software Engineering & Project Management (21AI64)", credits: 3, grade: "A" },
    { id: 5, name: "Professional Elective - Cloud Computing (21CS65)", credits: 3, grade: "A+" },
    { id: 6, name: "Deep Learning Lab (21AIL66)", credits: 1.5, grade: "O" },
    { id: 7, name: "Mini Project in AI (21AIM67)", credits: 2, grade: "O" },
    { id: 8, name: "Innovation & Design Thinking (21IDT68)", credits: 1, grade: "O" }
  ]
};

export const gradePointsMap = {
  "O": 10,
  "A+": 9,
  "A": 8,
  "B+": 7,
  "B": 6,
  "C": 5,
  "P": 4,
  "F": 0
};

export const initialSkills = [
  {
    name: "Python & Scientific Computing",
    category: "Languages",
    level: 75,
    benchmark: 75,
    status: "Self-Assessed",
    details: "NumPy, Pandas, Vectorized Ops, Python OOP",
    color: "from-purple-500 to-indigo-600"
  },
  {
    name: "Machine Learning & Scikit-Learn",
    category: "Core AI",
    level: 70,
    benchmark: 75,
    status: "Self-Assessed",
    details: "Supervised, Unsupervised, Ensembles, Feature Eng.",
    color: "from-violet-500 to-purple-600"
  },
  {
    name: "Deep Learning (PyTorch & CNNs)",
    category: "Deep Learning",
    level: 65,
    benchmark: 70,
    status: "In Progress",
    details: "Backprop, Transfer Learning, ResNet, Vision Models",
    color: "from-fuchsia-500 to-purple-600"
  },
  {
    name: "Data Structures & VTU DAA",
    category: "CS Core",
    level: 70,
    benchmark: 75,
    status: "Self-Assessed",
    details: "Trees, Graphs, DP, Divide & Conquer algorithms",
    color: "from-indigo-500 to-purple-500"
  },
  {
    name: "SQL & Relational Databases",
    category: "Data Engineering",
    level: 65,
    benchmark: 70,
    status: "Self-Assessed",
    details: "Complex Joins, Normalization (BCNF), Indexing",
    color: "from-purple-600 to-pink-500"
  },
  {
    name: "Natural Language Processing (NLP)",
    category: "Applied AI",
    level: 60,
    benchmark: 70,
    status: "In Progress",
    details: "Tokenization, Transformers, Attention, BERT",
    color: "from-lavender-500 to-purple-700"
  },
  {
    name: "Cloud MLOps & Docker Deployment",
    category: "Deployment",
    level: 50,
    benchmark: 70,
    status: "Needs Focus",
    details: "Containerization, FastAPI microservices, CI/CD",
    color: "from-amber-500 to-orange-500"
  }
];

export const skillImprovementAreas = [
  {
    title: "ML Model Deployment & Containerization (Docker)",
    description: "Wrap trained models into lightweight container images for reproducible deployment.",
    priority: "High Priority",
    estimatedWeeks: "2 Weeks"
  },
  {
    title: "Dynamic Programming & Graph Traversal Optimization",
    description: "Deepen understanding of multi-stage decisions and memoization for complex computational problems.",
    priority: "Medium Priority",
    estimatedWeeks: "3 Weeks"
  },
  {
    title: "Cloud Infrastructure Fundamentals (AWS / GCP)",
    description: "Explore managed training clusters and object storage for large model datasets.",
    priority: "Medium Priority",
    estimatedWeeks: "4 Weeks"
  }
];

export const personalizedRoadmap = [
  {
    step: 1,
    week: "Week 1",
    title: "Dockerizing AI Microservices",
    description: "Wrap trained PyTorch or Scikit-Learn inference scripts into FastAPI endpoints and containerize using Docker.",
    tasks: ["Build FastAPI model inference route", "Write lightweight Dockerfile", "Test container health checks locally"],
    platform: "Docker & FastAPI Documentation"
  },
  {
    step: 2,
    week: "Week 2",
    title: "Model Optimization & Quantization",
    description: "Convert model weights to ONNX format and explore quantization for reduced memory footprint.",
    tasks: ["Export model to ONNX runtime format", "Benchmark latency vs memory footprint", "Test ONNX inference in Python"],
    platform: "Hugging Face Optimum & PyTorch Docs"
  },
  {
    step: 3,
    week: "Week 3",
    title: "Vector Databases & Semantic Search",
    description: "Explore document chunking and embedding storage with ChromaDB or FAISS.",
    tasks: ["Chunk and embed syllabus documents", "Implement similarity search", "Generate responses with citations"],
    platform: "Open Source AI Guides"
  },
  {
    step: 4,
    week: "Week 4",
    title: "Cloud Deployment Pipeline",
    description: "Set up automated model tracking and container registry workflows.",
    tasks: ["Track experiments with MLflow", "Push Docker image to registry", "Test cloud container serving"],
    platform: "Cloud Free Tier Tutorials"
  }
];

export const recommendedResources = [
  {
    id: "rec1",
    title: "Deep Learning (VTU Recommended Course)",
    instructor: "IIT Madras / NPTEL SWAYAM",
    type: "Academic Video Course",
    url: "https://nptel.ac.in",
    tag: "VTU Aligned",
    duration: "12 Weeks"
  },
  {
    id: "rec2",
    title: "Machine Learning Specialization",
    instructor: "Andrew Ng / DeepLearning.AI",
    type: "Online Course",
    url: "https://coursera.org",
    tag: "Industry Standard",
    duration: "Self-Paced"
  },
  {
    id: "rec3",
    title: "Python for Data Science & ML",
    instructor: "NPTEL SWAYAM Platform",
    type: "Curriculum Course",
    url: "https://swayam.gov.in",
    tag: "VTU Accredited",
    duration: "8 Weeks"
  },
  {
    id: "rec4",
    title: "FastAPI Documentation & Guides",
    instructor: "Open Source Community",
    type: "Interactive Docs",
    url: "https://fastapi.tiangolo.com",
    tag: "Hands-on",
    duration: "Self-Paced"
  }
];

export const quickNotices = [
  {
    id: "n-1",
    title: "VTU Examination Notification",
    date: "Current Semester",
    urgent: true,
    desc: "Refer to official VTU notification for examination registration deadlines and schedule."
  },
  {
    id: "n-2",
    title: "Canara Engineering College Internal Assessment Schedule",
    date: "Academic Notice",
    urgent: false,
    desc: "Internal assessment tests will be conducted as per the college academic calendar."
  },
  {
    id: "n-3",
    title: "NPTEL SWAYAM Credit Transfer Circular",
    date: "VTU Guideline",
    urgent: false,
    desc: "Submit completed NPTEL certificates to your department coordinator for elective credit mapping."
  }
];
