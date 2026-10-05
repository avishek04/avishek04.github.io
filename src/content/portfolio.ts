export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};

export type CapabilityGroup = {
  title: string;
  description: string;
  skills: string[];
};

export type WorkPrinciple = {
  title: string;
  description: string;
};

export type NarrativeSegment = {
  text: string;
  href?: string;
};

export type SiteProfile = {
  name: string;
  shortName: string;
  homeNarrative: NarrativeSegment[][];
  biography: string[];
  location: string;
  availability: string;
  email: string;
  additionalEmails: string[];
  siteUrl: string;
  resumeUrl?: string;
  portrait: string;
  socials: SocialLink[];
  capabilities: CapabilityGroup[];
  workPrinciples: WorkPrinciple[];
  privacy: {
    summary: string;
    collected: string;
    protections: string;
    retention: string;
  };
  seo: {
    title: string;
    description: string;
  };
};

export type ExperienceItem = {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  location?: string;
  note?: string;
  highlights: string[];
  technologies: string[];
};

export type EducationItem = {
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
  location?: string;
  focus?: string;
  gpa?: string;
  coursework?: string[];
  highlights?: string[];
};

export type ProjectItem = {
  title: string;
  category: string;
  summary: string;
  impact?: string;
  technologies: string[];
  priority: number;
  featured: boolean;
  year?: number;
  image?: string;
  imageAlt?: string;
  repositoryUrl?: string;
  liveUrl?: string;
};

export type SkillEvidenceKind = "Experience" | "Project" | "Course";

export type SkillEvidence = {
  kind: SkillEvidenceKind;
  title: string;
  href: string;
};

export type SkillMapItem = {
  id: string;
  label: string;
  category: string;
  evidence: SkillEvidence[];
};

export type ExploreItem = {
  title: string;
  section: "Trips" | "Blogs" | "Interests";
  category: string;
  description: string;
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  date?: string;
  links?: Array<{
    label: string;
    href: string;
  }>;
};

export const profile: SiteProfile = {
  name: "Avishek Choudhury",
  shortName: "AC",
  homeNarrative: [
    [
      { text: "I’m a Software Engineer at " },
      {
        text: "University of Utah Health",
        href: "https://healthcare.utah.edu/",
      },
      {
        text: ", where I build intelligent systems that help clinicians and researchers reach the information they need, support more informed decisions, and streamline workflows across one of the Mountain West’s leading academic health systems. I currently own three projects: an identity and session platform spanning 8+ distributed services; a RAG pipeline that maps entities and relationships across 1,000+ SQL tables using Qdrant vector search; and an LLM-based SQL platform that provides conversational access to large healthcare datasets. Together, these systems are designed to absorb traffic bursts of 2,000+ requests per second and have reduced clinical research effort by 20%.",
      },
    ],
    [
      { text: "Before this role, I completed an M.S. in Computing with a specialization in Artificial Intelligence at the " },
      {
        text: "University of Utah",
        href: "https://www.utah.edu/",
      },
      { text: ". Working with " },
      {
        text: "Professor Shandian Zhe",
        href: "https://users.cs.utah.edu/~zhe/",
      },
      {
        text: ", I contributed to applied large-language-model research and open-sourced MedLam, a medical question-answering model that reached 5,000+ downloads on Hugging Face. As a teaching assistant for Operating Systems and Database Systems, I mentored more than 50 graduate students through code reviews, systems concepts, and difficult debugging problems. Coursework in distributed systems, graduate algorithms, machine learning, natural language processing, computer vision, and artificial intelligence gave me the theoretical foundation to complement the systems I enjoy building.",
      },
    ],
    [
      { text: "Earlier in my career, I spent nearly four years at " },
      {
        text: "Accenture",
        href: "https://www.accenture.com/",
      },
      {
        text: ", progressing from Associate Software Engineer to Senior Software Engineer. I built responsive product experiences, improved API response times by 30%, designed fault-tolerant messaging that processed 5,000+ events per second, and helped deliver a UK project expected to generate $1.2 million in revenue. That progression taught me how to move from solving an assigned problem to owning the outcome—understanding the business need, making the technical trade-offs clear, and carrying a system through delivery.",
      },
    ],
  ],
  biography: [
    "I’m a software engineer who enjoys turning ambiguous problems into dependable software. My path has moved through enterprise product development, graduate research and teaching, and healthcare engineering, with backend systems, full-stack products, and applied AI along the way.",
    "I started as a self-taught programmer, and that beginner’s curiosity still shapes how I work. I like asking the simple questions, listening closely to the people who use a system, and finding the clearest path through a complicated problem.",
    "When I’m away from the keyboard, you’ll usually find me hiking around Utah, experimenting in the kitchen, taking photographs, or strength training. Those pursuits keep me observant, patient, and ready to learn something new.",
  ],
  location: "Salt Lake City, UT",
  availability: "Open to software engineering opportunities across the United States.",
  email: "choudhury.avishek96@gmail.com",
  additionalEmails: ["avishekchoudhury04@gmail.com"],
  siteUrl: "https://avishek04.github.io",
  resumeUrl: "/documents/Avishek-Choudhury-Resume.pdf",
  portrait: "/images/profile.webp",
  socials: [
    {
      label: "LinkedIn",
      handle: "/in/avishekchoudhury",
      href: "https://www.linkedin.com/in/avishekchoudhury",
    },
    {
      label: "GitHub",
      handle: "@avishek04",
      href: "https://github.com/avishek04",
    },
    {
      label: "Medium",
      handle: "@avishekchoudhury",
      href: "https://medium.com/@avishekchoudhury",
    },
  ],
  capabilities: [
    {
      title: "Systems & backend",
      description: "Reliable services, clear contracts, and data flows designed for change.",
      skills: ["Distributed systems", "REST & GraphQL", "Microservices", "Kafka", "Redis", "SQL"],
    },
    {
      title: "Product engineering",
      description: "End-to-end delivery from interface and API to production operations.",
      skills: ["React", ".NET", "Spring Boot", "C#", "Java", "JavaScript"],
    },
    {
      title: "Applied AI",
      description: "Practical machine-learning systems grounded in measurable evaluation.",
      skills: ["PyTorch", "Transformers", "NLP", "TensorFlow", "Pandas", "Apache Spark"],
    },
    {
      title: "Cloud & delivery",
      description: "Repeatable delivery practices that make software safer to operate.",
      skills: ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD", "Git"],
    },
  ],
  workPrinciples: [
    {
      title: "Understand the problem",
      description:
        "I start with the people, constraints, and outcome before choosing an architecture or technology.",
    },
    {
      title: "Make trade-offs clear",
      description:
        "I prefer simple boundaries, readable decisions, and honest conversations about complexity and risk.",
    },
    {
      title: "Deliver with care",
      description:
        "I work in small, verifiable steps and leave systems easier for the next person to understand and change.",
    },
  ],
  privacy: {
    summary:
      "I use a small, self-managed analytics service to understand which pages and portfolio entries are useful to visitors.",
    collected:
      "It records the page path, referring website hostname, time spent on experience and project entries, project source-link clicks, a random per-tab session identifier, and an approximate city, region, and country supplied by Cloudflare.",
    protections:
      "It does not use cookies, advertising trackers, browser fingerprinting, or GPS, and it does not store raw IP addresses in the analytics database or application logs. Cloudflare uses the connection address transiently to enforce an abuse-prevention rate limit.",
    retention:
      "Raw events are retained for 30 days and then deleted after daily aggregate summaries are created. Tracking is disabled when the browser sends Global Privacy Control or Do Not Track.",
  },
  seo: {
    title: "Avishek Choudhury — Software Engineer",
    description:
      "Portfolio of Avishek Choudhury, a software engineer working across backend systems, full-stack products, distributed systems, and applied AI.",
  },
};

export const experience: ExperienceItem[] = [
  {
    company: "University of Utah Health",
    role: "Software Engineer",
    startDate: "2025-12",
    current: true,
    location: "Salt Lake City, UT",
    note: "Building distributed healthcare systems and AI-assisted workflows.",
    highlights: [
      "Centralized authentication and session management across 8+ distributed services by integrating OpenID Connect at the API gateway.",
      "Automated entity and relationship discovery across 1,000+ SQL tables by architecting a RAG pipeline with vector search and context retrieval.",
      "Scaled and secured a RAG platform with caching, rate limiting, and asynchronous queuing to absorb traffic bursts of 2,000+ requests per second.",
      "Reduced clinical research effort by 20% by building an LLM-based SQL platform that provides conversational access to large-scale healthcare datasets.",
    ],
    technologies: ["C#", ".NET", "REST APIs", "Redis", "RabbitMQ", "Azure DevOps", "SQL", "NoSQL", "Qdrant", "OpenAI API", "OIDC", "JWT", "React"],
  },
  {
    company: "University of Utah",
    role: "Teaching Assistant and Researcher",
    startDate: "2023-08",
    endDate: "2025-05",
    location: "Salt Lake City, UT",
    note: "Research across applied AI and teaching assistant for core computer science courses.",
    highlights: [
      "Mentored 50+ M.S. students in Operating Systems and Database Systems, providing technical guidance, reviewing code, and resolving complex issues.",
      "Open-sourced a medical question-answering LLM that reached 5,000+ downloads on Hugging Face after fine-tuning Meta's Llama with LoRA and PEFT.",
    ],
    technologies: ["Operating Systems", "Database Systems", "C++", "C#", "Python", "PyTorch", "Machine Learning", "LLMs"],
  },
  {
    company: "University of Utah",
    role: "Software Development Intern",
    startDate: "2023-01",
    endDate: "2023-08",
    location: "Salt Lake City, UT",
    highlights: [
      "Expanded the consumer base by 10% by designing a product recommendation system for an e-commerce platform in partnership with the sales team.",
      "Improved click-through rates and campaign effectiveness by 20% by analyzing user traffic and optimizing the ad-placement strategy.",
    ],
    technologies: ["Python", "PyTorch", "Apache Spark", "Google Analytics", "PostgreSQL"],
  },
  {
    company: "Accenture",
    role: "Senior Software Engineer",
    startDate: "2021-11",
    endDate: "2022-07",
    location: "Hyderabad, India",
    highlights: [
      "Delivered and owned a UK project expected to generate $1.2M in revenue by translating business requirements into scalable software solutions.",
      "Scaled data exchange across distributed services by designing a fault-tolerant asynchronous messaging architecture processing 5,000+ events per second.",
      "Reduced policy creation time by five minutes by designing a buyer-policy matching algorithm over 500,000 records.",
    ],
    technologies: ["C#", ".NET Core", "REST APIs", "RabbitMQ", "JWT", "Unit Testing", "SQL", "Microsoft Azure"],
  },
  {
    company: "Accenture",
    role: "Software Engineer",
    startDate: "2020-11",
    endDate: "2021-11",
    location: "Hyderabad, India",
    highlights: [
      "Automated data fetching from third-party APIs and persistence to Microsoft SQL Server by constructing a data-access layer with Entity Framework.",
      "Reduced average server response time by 30% by caching RESTful APIs and optimizing code in the business layer.",
    ],
    technologies: ["C#", ".NET Core", "RESTful APIs", "Entity Framework", "Microsoft SQL Server", "Redis"],
  },
  {
    company: "Accenture",
    role: "Associate Software Engineer",
    startDate: "2018-11",
    endDate: "2020-11",
    location: "Hyderabad, India",
    highlights: [
      "Architected a responsive JavaScript interface, improving page-load time by 50% through optimized AJAX calls to RESTful APIs.",
    ],
    technologies: ["JavaScript", "AJAX", "RESTful APIs"],
  },
];

export const education: EducationItem[] = [
  {
    institution: "University of Utah",
    degree: "M.S. in Computing",
    focus: "With Specialization in AI",
    startDate: "2023-08",
    endDate: "2025-04",
    location: "Salt Lake City, Utah",
    gpa: "3.87",
    coursework: [
      "Distributed Systems",
      "Graduate Algorithms",
      "Machine Learning",
      "Natural Language Processing",
      "Computer Vision",
      "Visualization",
      "Artificial Intelligence",
    ],
    highlights: [
      "Conducted large-language-model research under Dr. Shandian Zhe.",
      "Supported Operating Systems and Database Systems courses as a teaching assistant.",
    ],
  },
  {
    institution: "University of Utah",
    degree: "Master of Software Development",
    startDate: "2022-08",
    endDate: "2023-04",
    location: "Salt Lake City, Utah",
    gpa: "4.0",
    coursework: [
      "Data Structures & Algorithms",
      "Software Engineering",
      "Operating Systems",
      "Networks & Security",
    ],
    highlights: ["Coursework transferred into the M.S. in Computing program."],
  },
  {
    institution: "B.M.S. College of Engineering",
    degree: "Bachelor of Engineering",
    startDate: "2014-08",
    endDate: "2018-04",
    location: "Bengaluru, India",
    gpa: "3.0 / 4.0",
  },
];

export const skillMap: SkillMapItem[] = [
  {
    id: "distributed-systems",
    label: "Distributed systems",
    category: "Systems",
    evidence: [
      {
        kind: "Experience",
        title: "UHealth engineering",
        href: "/experience/#university-of-utah-health-software-engineer",
      },
      {
        kind: "Experience",
        title: "Accenture messaging",
        href: "/experience/#accenture-senior-software-engineer",
      },
      {
        kind: "Project",
        title: "Replicated key-value store",
        href: "/projects/#replicated-key-value-store",
      },
      {
        kind: "Project",
        title: "Real-time chat server",
        href: "/projects/#real-time-group-chat-server",
      },
      {
        kind: "Course",
        title: "Distributed Systems",
        href: "/education/#university-of-utah-m-s-in-computing",
      },
    ],
  },
  {
    id: "csharp-dotnet",
    label: "C# & .NET",
    category: "Backend",
    evidence: [
      {
        kind: "Experience",
        title: "UHealth engineering",
        href: "/experience/#university-of-utah-health-software-engineer",
      },
      {
        kind: "Experience",
        title: "Accenture senior role",
        href: "/experience/#accenture-senior-software-engineer",
      },
      {
        kind: "Experience",
        title: "Accenture software role",
        href: "/experience/#accenture-software-engineer",
      },
      {
        kind: "Project",
        title: "COVID-19 Information Hub",
        href: "/projects/#covid-19-information-hub",
      },
      {
        kind: "Course",
        title: "Software development",
        href: "/education/#university-of-utah-master-of-software-development",
      },
    ],
  },
  {
    id: "applied-ai-llms",
    label: "Applied AI & LLMs",
    category: "Artificial intelligence",
    evidence: [
      {
        kind: "Experience",
        title: "UHealth AI systems",
        href: "/experience/#university-of-utah-health-software-engineer",
      },
      {
        kind: "Experience",
        title: "LLM research",
        href: "/experience/#university-of-utah-teaching-assistant-and-researcher",
      },
      {
        kind: "Project",
        title: "MedLam",
        href: "/projects/#medlam",
      },
      {
        kind: "Project",
        title: "Trajectory Generation BERT",
        href: "/projects/#trajectory-generation-bert",
      },
      {
        kind: "Course",
        title: "AI specialization",
        href: "/education/#university-of-utah-m-s-in-computing",
      },
    ],
  },
  {
    id: "python",
    label: "Python",
    category: "Language",
    evidence: [
      {
        kind: "Experience",
        title: "LLM research",
        href: "/experience/#university-of-utah-teaching-assistant-and-researcher",
      },
      {
        kind: "Experience",
        title: "Software development internship",
        href: "/experience/#university-of-utah-software-development-intern",
      },
      { kind: "Project", title: "MedLam", href: "/projects/#medlam" },
      {
        kind: "Project",
        title: "Trajectory Generation BERT",
        href: "/projects/#trajectory-generation-bert",
      },
      {
        kind: "Project",
        title: "Machine-learning library",
        href: "/projects/#machine-learning-library",
      },
    ],
  },
  {
    id: "sql-data",
    label: "SQL & data",
    category: "Data",
    evidence: [
      {
        kind: "Experience",
        title: "UHealth data systems",
        href: "/experience/#university-of-utah-health-software-engineer",
      },
      {
        kind: "Experience",
        title: "Database Systems teaching",
        href: "/experience/#university-of-utah-teaching-assistant-and-researcher",
      },
      {
        kind: "Experience",
        title: "Recommendation systems",
        href: "/experience/#university-of-utah-software-development-intern",
      },
      {
        kind: "Experience",
        title: "Accenture data access",
        href: "/experience/#accenture-software-engineer",
      },
      {
        kind: "Project",
        title: "COVID-19 Information Hub",
        href: "/projects/#covid-19-information-hub",
      },
    ],
  },
  {
    id: "rest-apis",
    label: "REST APIs",
    category: "Backend",
    evidence: [
      {
        kind: "Experience",
        title: "UHealth services",
        href: "/experience/#university-of-utah-health-software-engineer",
      },
      {
        kind: "Experience",
        title: "Accenture senior role",
        href: "/experience/#accenture-senior-software-engineer",
      },
      {
        kind: "Experience",
        title: "Accenture software role",
        href: "/experience/#accenture-software-engineer",
      },
      {
        kind: "Experience",
        title: "Accenture associate role",
        href: "/experience/#accenture-associate-software-engineer",
      },
      {
        kind: "Project",
        title: "COVID-19 Information Hub",
        href: "/projects/#covid-19-information-hub",
      },
    ],
  },
  {
    id: "messaging-queues",
    label: "Messaging & queues",
    category: "Systems",
    evidence: [
      {
        kind: "Experience",
        title: "UHealth queuing",
        href: "/experience/#university-of-utah-health-software-engineer",
      },
      {
        kind: "Experience",
        title: "Accenture messaging",
        href: "/experience/#accenture-senior-software-engineer",
      },
      {
        kind: "Project",
        title: "Real-time chat server",
        href: "/projects/#real-time-group-chat-server",
      },
    ],
  },
  {
    id: "redis-caching",
    label: "Redis & caching",
    category: "Performance",
    evidence: [
      {
        kind: "Experience",
        title: "UHealth platform caching",
        href: "/experience/#university-of-utah-health-software-engineer",
      },
      {
        kind: "Experience",
        title: "Accenture API caching",
        href: "/experience/#accenture-software-engineer",
      },
      {
        kind: "Project",
        title: "Caching DNS resolver",
        href: "/projects/#caching-dns-resolver",
      },
    ],
  },
  {
    id: "pytorch",
    label: "PyTorch",
    category: "Machine learning",
    evidence: [
      {
        kind: "Experience",
        title: "LLM research",
        href: "/experience/#university-of-utah-teaching-assistant-and-researcher",
      },
      {
        kind: "Experience",
        title: "Software development internship",
        href: "/experience/#university-of-utah-software-development-intern",
      },
      { kind: "Project", title: "MedLam", href: "/projects/#medlam" },
      {
        kind: "Project",
        title: "Trajectory Generation BERT",
        href: "/projects/#trajectory-generation-bert",
      },
      {
        kind: "Project",
        title: "Machine-learning library",
        href: "/projects/#machine-learning-library",
      },
    ],
  },
  {
    id: "react-javascript",
    label: "React & JavaScript",
    category: "Frontend",
    evidence: [
      {
        kind: "Experience",
        title: "UHealth product UI",
        href: "/experience/#university-of-utah-health-software-engineer",
      },
      {
        kind: "Experience",
        title: "Accenture responsive UI",
        href: "/experience/#accenture-associate-software-engineer",
      },
      {
        kind: "Project",
        title: "Face recognition web app",
        href: "/projects/#face-recognition-web-app",
      },
      {
        kind: "Project",
        title: "COVID-19 Information Hub",
        href: "/projects/#covid-19-information-hub",
      },
      {
        kind: "Project",
        title: "70 Years of Music",
        href: "/projects/#70-years-of-music",
      },
    ],
  },
  {
    id: "cpp-operating-systems",
    label: "C++ & operating systems",
    category: "Systems",
    evidence: [
      {
        kind: "Experience",
        title: "Operating Systems teaching",
        href: "/experience/#university-of-utah-teaching-assistant-and-researcher",
      },
      { kind: "Project", title: "Unix shell", href: "/projects/#unix-shell" },
      {
        kind: "Project",
        title: "MSD Script interpreter",
        href: "/projects/#msd-script-interpreter",
      },
      {
        kind: "Course",
        title: "Operating Systems",
        href: "/education/#university-of-utah-master-of-software-development",
      },
    ],
  },
  {
    id: "java-networking",
    label: "Java & networking",
    category: "Backend",
    evidence: [
      {
        kind: "Project",
        title: "Real-time chat server",
        href: "/projects/#real-time-group-chat-server",
      },
      {
        kind: "Project",
        title: "Caching DNS resolver",
        href: "/projects/#caching-dns-resolver",
      },
      {
        kind: "Course",
        title: "Networks & Security",
        href: "/education/#university-of-utah-master-of-software-development",
      },
    ],
  },
  {
    id: "qdrant-vector-search",
    label: "Qdrant & vector search",
    category: "AI infrastructure",
    evidence: [
      {
        kind: "Experience",
        title: "UHealth RAG platform",
        href: "/experience/#university-of-utah-health-software-engineer",
      },
    ],
  },
  {
    id: "go-raft",
    label: "Go & Raft",
    category: "Distributed systems",
    evidence: [
      {
        kind: "Project",
        title: "Replicated key-value store",
        href: "/projects/#replicated-key-value-store",
      },
      {
        kind: "Course",
        title: "Distributed Systems",
        href: "/education/#university-of-utah-m-s-in-computing",
      },
    ],
  },
];

export const projects: ProjectItem[] = [
  {
    title: "MedLam",
    category: "Applied AI",
    summary:
      "A medical question-answering language model fine-tuned with LoRA and PEFT over a 100,000-record data pipeline.",
    impact: "Reached 5,000+ downloads and improved ROUGE and BERT evaluation scores by 20%.",
    technologies: ["Python", "PyTorch", "Spark", "LoRA / PEFT", "Transformers", "NLP"],
    priority: 100,
    featured: true,
    image: "/images/projects/medlam.webp",
    imageAlt: "MedLam medical language model project interface",
    liveUrl: "https://huggingface.co/aviici4cs/MedLam",
  },
  {
    title: "Replicated key-value store",
    category: "Distributed systems",
    summary:
      "A fault-tolerant key-value store implementing Raft leader election, persistent log replication, state recovery, and strong consistency.",
    impact: "Achieved leader failover in four seconds using five to six heartbeats per second.",
    technologies: ["Go", "Raft", "Linux", "Distributed systems"],
    priority: 95,
    featured: true,
    image: "/images/projects/raft-store.webp",
    imageAlt: "Diagram representing a distributed key-value store",
    repositoryUrl: "https://github.com/avishek04/DistributedSystems/tree/main",
  },
  {
    title: "Real-time group chat server",
    category: "Backend engineering",
    summary:
      "A multi-client server using WebSockets and multithreading to coordinate concurrent group conversations.",
    impact: "Handled up to 100 live group members with 99% uptime and 30% lower message latency.",
    technologies: ["Java", "WebSockets", "Multithreading", "Networking"],
    priority: 90,
    featured: true,
    image: "/images/projects/group-chat.webp",
    imageAlt: "Illustration of clients connected to a real-time chat server",
    repositoryUrl: "https://github.com/avishek04/Live-Group-Chat-Server",
  },
  {
    title: "Trajectory Generation BERT",
    category: "Machine learning",
    summary:
      "A trajectory-imputation framework that treats missing GPS coordinates like missing words and uses BERT to generate plausible paths without a dense road network.",
    technologies: ["Python", "BERT", "NumPy", "Pandas", "Spark"],
    priority: 80,
    featured: false,
    image: "/images/projects/trajectory-bert.webp",
    imageAlt: "Map showing an imputed trajectory between sparse GPS points",
    repositoryUrl: "https://github.com/avishek04/Trajectory-Generation-BERT",
  },
  {
    title: "COVID-19 Information Hub",
    category: "Full-stack",
    summary:
      "A public information portal combining global news, social data, and large daily datasets into accessible charts and tables.",
    technologies: ["C#", ".NET", "JavaScript", "Entity Framework", "MS SQL"],
    priority: 75,
    featured: false,
    image: "/images/projects/covid-hub.webp",
    imageAlt: "COVID-19 information dashboard with data visualizations",
    repositoryUrl: "https://github.com/avishek04/COVID_19-WebApp-DotnetCore-MSSQL-JavaScript",
  },
  {
    title: "70 Years of Music",
    category: "Data visualization",
    summary:
      "An interactive exploration of how popular music, genres, audio attributes, and lyrical patterns changed from 1950 to 2019.",
    technologies: ["D3.js", "JavaScript", "Python", "HTML", "CSS"],
    priority: 70,
    featured: false,
    image: "/images/projects/music-viz.webp",
    imageAlt: "Interactive visualization of music history and genre trends",
    repositoryUrl: "https://github.com/avishek04/70YearsMusicVisualization-D3",
  },
  {
    title: "Unix shell",
    category: "Operating systems",
    summary:
      "A compact command-line shell supporting command execution, input/output redirection, and pipelines familiar from Bash and Zsh.",
    technologies: ["C++", "Unix", "Processes", "Pipes"],
    priority: 60,
    featured: false,
    image: "/images/projects/unix-shell.webp",
    imageAlt: "Terminal window running a custom Unix shell",
    repositoryUrl: "https://github.com/avishek04/UnixShell-CommandLine",
  },
  {
    title: "Caching DNS resolver",
    category: "Computer networking",
    summary:
      "A multithreaded Java DNS resolver that caches earlier responses to accelerate repeated domain requests.",
    technologies: ["Java", "DNS", "Caching", "Multithreading"],
    priority: 55,
    featured: false,
    image: "/images/projects/dns-resolver-ai.webp",
    imageAlt: "Illustration of a client using a caching resolver connected to upstream DNS servers",
    repositoryUrl: "https://github.com/avishek04/DNS-Resolver",
  },
  {
    title: "MSD Script interpreter",
    category: "Language implementation",
    summary:
      "An interpreter for a case-sensitive scripting language with expressions, variable bindings, and function definition and invocation.",
    technologies: ["C++", "Parsing", "Interpreters", "OOP"],
    priority: 50,
    featured: false,
    image: "/images/projects/msd-script-ai.webp",
    imageAlt: "Illustration of source tokens passing through a parser and syntax tree into an execution result",
    repositoryUrl: "https://github.com/avishek04/MSDScript-Interpreter",
  },
  {
    title: "Face recognition web app",
    category: "Full-stack & ML",
    summary:
      "An authenticated web application that locates faces in submitted images and tracks each user's request history.",
    technologies: ["React", "Node.js", "Express", "PostgreSQL", "Machine-learning API"],
    priority: 45,
    featured: false,
    image: "/images/projects/face-recognition.webp",
    imageAlt: "Face detection interface with a bounding box around a face",
    repositoryUrl: "https://github.com/avishek04/SmartApp-Frontend-API-React",
  },
  {
    title: "Machine-learning library",
    category: "Machine learning",
    summary:
      "A from-scratch collection of classical models including decision trees, ensembles, perceptrons, support-vector machines, logistic regression, and neural networks.",
    technologies: ["Python", "Decision trees", "Ensembles", "SVM", "Neural networks"],
    priority: 40,
    featured: false,
    image: "/images/projects/ml-library-ai.webp",
    imageAlt: "Illustration of a reusable machine-learning toolkit connected to several classical model families",
    repositoryUrl: "https://github.com/avishek04/Machine-Learning-Library",
  },
];

export const explore: ExploreItem[] = [
  {
    title: "Finding the long way up",
    section: "Trips",
    category: "Hiking",
    description:
      "Time on a trail is how I reset perspective: one steady step, fewer distractions, and a wider view of the problem than I had at the start.",
  },
  {
    title: "LoRA, an efficient approach to fine-tuning a Large Language Model",
    section: "Blogs",
    category: "Large language models",
    description:
      "A practical explanation of why parameter-efficient fine-tuning matters, how Low-Rank Adaptation updates a small set of trainable weights, and how I applied it while building the MedLam medical question-answering model.",
    image: "/images/explore/lora-fine-tuning.png",
    imageAlt: "Diagram showing LoRA adapter training and the merged model weights after training",
    imageFit: "contain",
    date: "Apr 4, 2025",
    links: [
      {
        label: "Read article",
        href: "https://medium.com/@avishekchoudhury/lora-an-efficient-approach-to-fine-tuning-large-language-model-5daad56f7000",
      },
      {
        label: "Try model",
        href: "https://huggingface.co/aviici4cs/MedLam",
      },
      {
        label: "View code",
        href: "https://github.com/avishek04/MedLam",
      },
    ],
  },
  {
    title: "Cooking as iteration",
    section: "Interests",
    category: "Cooking",
    description:
      "I enjoy the loop of learning a technique, tasting the result, and adjusting. It is creative work with immediate and honest feedback.",
  },
  {
    title: "Learning to notice",
    section: "Interests",
    category: "Photography",
    description:
      "Photography is a practice in paying attention—to light, proportion, ordinary details, and the stories that appear when I slow down.",
  },
  {
    title: "The value of consistency",
    section: "Interests",
    category: "Strength training",
    description:
      "Training keeps me grounded in patient, repeatable progress. Small improvements compound when the fundamentals stay sound.",
  },
];

export const exploreSections: Array<{
  title: ExploreItem["section"];
  description: string;
}> = [
  {
    title: "Trips",
    description: "Trails, places, and journeys that help me slow down, notice more, and return with a wider perspective.",
  },
  {
    title: "Blogs",
    description: "Technical notes and reflections on software, systems, artificial intelligence, and the process of learning.",
  },
  {
    title: "Interests",
    description: "The practices outside engineering that keep me curious, patient, creative, and consistent.",
  },
];
