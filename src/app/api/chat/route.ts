import { NextResponse } from 'next/server';
import { ChatRequest, ChatResponse } from '@/types/chat';
import { getSectionIdFromQuery } from '@/utils/navigation';

// Simple mock response generator
function generateResponse(message: string): ChatResponse {
  const normalizedMessage = message.toLowerCase();
  
  // Check for navigation intent
  const navTarget = getSectionIdFromQuery(normalizedMessage);
  
  // Common greetings
  if (/^(hi|hello|hey|greetings)[\s!.?]*$/i.test(normalizedMessage)) {
    return {
      assistantMessage: "Hello! I'm Alistair's portfolio assistant. How can I help you today? You can ask about Alistair's projects, skills, experience, or anything else you'd like to know.",
    };
  }
  
  // About Alistair
  if (normalizedMessage.includes('who is') || normalizedMessage.includes('about alistair') || normalizedMessage.includes('tell me about')) {
    return {
      assistantMessage: "Alistair Grenyer is a passionate Software Engineer with expertise in modern web technologies. He specializes in building responsive, accessible web applications using React, Next.js, and TypeScript. He's committed to clean code, performance optimization, and creating exceptional user experiences.",
      navTarget: 'about'
    };
  }
  
  // Projects
  if (normalizedMessage.includes('project') || normalizedMessage.includes('portfolio') || normalizedMessage.includes('work')) {
    return {
      assistantMessage: "Alistair has worked on various projects, including web applications, e-commerce platforms, and data visualization tools. His portfolio showcases projects built with React, Next.js, TypeScript, and other modern technologies. Would you like to see his featured projects?",
      navTarget: 'projects'
    };
  }
  
  // Skills
  if (normalizedMessage.includes('skill') || normalizedMessage.includes('tech') || normalizedMessage.includes('technolog') || normalizedMessage.includes('stack')) {
    return {
      assistantMessage: "Alistair's skill set includes frontend technologies like React, Next.js, and TypeScript, backend technologies like Node.js and Express, and databases like MongoDB and PostgreSQL. He's also proficient in DevOps tools and practices. You can see his complete skill set in the Skills section.",
      navTarget: 'skills'
    };
  }
  
  // Experience
  if (normalizedMessage.includes('experience') || normalizedMessage.includes('job') || normalizedMessage.includes('work history') || normalizedMessage.includes('career')) {
    return {
      assistantMessage: "Alistair has several years of experience working with leading tech companies. His roles have ranged from Frontend Developer to Full Stack Engineer, where he's contributed to impactful projects and collaborated with cross-functional teams. You can find his detailed work history in the Experience section.",
      navTarget: 'experience'
    };
  }
  
  // Education
  if (normalizedMessage.includes('education') || normalizedMessage.includes('degree') || normalizedMessage.includes('university') || normalizedMessage.includes('certification') || normalizedMessage.includes('study')) {
    return {
      assistantMessage: "Alistair has a strong educational background in Computer Science and continues to expand his knowledge through professional certifications and courses. You can find details about his education and certifications in the Education section.",
      navTarget: 'education'
    };
  }
  
  // Contact
  if (normalizedMessage.includes('contact') || normalizedMessage.includes('email') || normalizedMessage.includes('get in touch') || normalizedMessage.includes('reach out') || normalizedMessage.includes('connect')) {
    return {
      assistantMessage: "You can contact Alistair through the contact form on this website, or connect with him on LinkedIn and GitHub. His professional email is also available in the Contact section.",
      navTarget: 'contact'
    };
  }
  
  // Resume
  if (normalizedMessage.includes('resume') || normalizedMessage.includes('cv')) {
    return {
      assistantMessage: "You can view Alistair's professional experience in the Experience section, or reach out through the Contact section to request his full resume.",
      navTarget: 'experience'
    };
  }
  
  // Social media
  if (normalizedMessage.includes('linkedin') || normalizedMessage.includes('github') || normalizedMessage.includes('twitter') || normalizedMessage.includes('social')) {
    return {
      assistantMessage: "You can find links to Alistair's professional profiles, including LinkedIn and GitHub, in the Contact section or in the footer of this website.",
      navTarget: 'contact'
    };
  }
  
  // Default response
  return {
    assistantMessage: "Thanks for your message. I'm a simple assistant for Alistair's portfolio website. You can ask me about Alistair's projects, skills, experience, education, or how to contact him. How can I help you today?",
    navTarget: navTarget || undefined
  };
}

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();
    
    // Simulate API processing time (300-800ms)
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    
    const response = generateResponse(body.userMessage);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
