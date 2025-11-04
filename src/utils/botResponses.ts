export interface BotResponse {
  message: string;
  options?: string[];
  escalate?: boolean;
}

export const getBotResponse = (userMessage: string): BotResponse => {
  const msg = userMessage.toLowerCase();

  // Greeting
  if (msg.match(/^(hi|hello|hey|namaste)/)) {
    return {
      message: "Hello! Welcome to KRUX Finance. I'm here to help you with your loan application. How can I assist you today?",
      options: [
        "Apply for a loan",
        "Check application status",
        "Document requirements",
        "Speak to an agent"
      ]
    };
  }

  // Loan application
  if (msg.includes('apply') || msg.includes('loan') || msg.includes('need money')) {
    return {
      message: "Great! We offer several types of loans:\n\n1. Business Loan - For growing your business\n2. Personal Loan - For personal needs\n3. MSME Loan - For micro, small & medium enterprises\n\nWhich type of loan are you interested in?",
      options: [
        "Business Loan",
        "Personal Loan",
        "MSME Loan",
        "Not sure, need help deciding"
      ]
    };
  }

  // Business loan
  if (msg.includes('business loan')) {
    return {
      message: "Business Loans from KRUX Finance:\n\n✓ Loan amount: ₹5 Lakh to ₹50 Crore\n✓ Interest rates starting from 10.5%\n✓ Tenure: Up to 5 years\n✓ Quick approval in 48 hours\n\nRequired documents:\n• PAN & Aadhaar\n• Business registration proof\n• Last 2 years ITR\n• Bank statements (6 months)\n• GST registration\n\nWould you like to proceed with the application?",
      options: [
        "Yes, start application",
        "Document requirements",
        "Check eligibility",
        "Speak to loan officer"
      ]
    };
  }

  // Personal loan
  if (msg.includes('personal loan')) {
    return {
      message: "Personal Loans from KRUX Finance:\n\n✓ Loan amount: ₹50,000 to ₹25 Lakh\n✓ Interest rates starting from 11.5%\n✓ Tenure: Up to 3 years\n✓ Minimal documentation\n✓ Quick disbursal\n\nRequired documents:\n• PAN & Aadhaar\n• Salary slips (last 3 months)\n• Bank statements (6 months)\n• Employment proof\n\nShall we begin your application?",
      options: [
        "Start application",
        "Check eligibility",
        "EMI calculator",
        "Speak to agent"
      ]
    };
  }

  // MSME loan
  if (msg.includes('msme')) {
    return {
      message: "MSME Loans from KRUX Finance:\n\n✓ Loan amount: ₹10 Lakh to ₹10 Crore\n✓ Competitive interest rates\n✓ Collateral-free options available\n✓ Government scheme benefits\n\nRequired documents:\n• Business registration\n• MSME/Udyam certificate\n• Financial statements\n• Bank statements\n• GST returns\n\nWould you like assistance with the application?",
      options: [
        "Apply now",
        "Eligibility criteria",
        "Required documents",
        "Talk to expert"
      ]
    };
  }

  // Application status
  if (msg.includes('status') || msg.includes('track') || msg.includes('application')) {
    return {
      message: "I can help you check your application status. Please provide your Application ID or registered phone number.",
      options: [
        "I have Application ID",
        "Use phone number",
        "Forgot Application ID",
        "Speak to agent"
      ]
    };
  }

  // Documents
  if (msg.includes('document') || msg.includes('paper') || msg.includes('proof')) {
    return {
      message: "Common documents required for loan applications:\n\n📄 Identity Proof:\n• PAN Card\n• Aadhaar Card\n• Passport\n\n📄 Address Proof:\n• Aadhaar\n• Utility bills\n• Rent agreement\n\n📄 Income Proof:\n• Salary slips / ITR\n• Bank statements\n\nSpecific requirements vary by loan type. Which loan are you interested in?",
      options: [
        "Business Loan docs",
        "Personal Loan docs",
        "MSME Loan docs",
        "General query"
      ]
    };
  }

  // Eligibility
  if (msg.includes('eligib') || msg.includes('qualify') || msg.includes('criteria')) {
    return {
      message: "General eligibility criteria:\n\n✓ Age: 21-65 years\n✓ Citizenship: Indian resident\n✓ Credit score: 650+\n✓ Stable income source\n✓ Valid KYC documents\n\nFor specific loan eligibility, please select your loan type or speak with our team.",
      options: [
        "Business Loan eligibility",
        "Personal Loan eligibility",
        "MSME eligibility",
        "Check my eligibility"
      ]
    };
  }

  // Interest rate / EMI
  if (msg.includes('interest') || msg.includes('rate') || msg.includes('emi')) {
    return {
      message: "Interest rates at KRUX Finance:\n\n• Personal Loan: Starting 11.5% p.a.\n• Business Loan: Starting 10.5% p.a.\n• MSME Loan: Starting 10% p.a.\n\nRates depend on:\n- Credit score\n- Loan amount\n- Tenure\n- Business vintage\n\nWould you like to calculate your EMI?",
      options: [
        "EMI calculator",
        "Rate details",
        "Apply for loan",
        "Speak to agent"
      ]
    };
  }

  // Contact / Human agent
  if (msg.includes('agent') || msg.includes('human') || msg.includes('talk') || 
      msg.includes('speak') || msg.includes('officer') || msg.includes('executive')) {
    return {
      message: "I'll connect you with one of our support agents right away. A team member will be with you shortly to assist with your query.",
      escalate: true
    };
  }

  // Help / confused
  if (msg.includes('help') || msg.includes('confused') || msg.includes('don\'t know')) {
    return {
      message: "I'm here to help! Here are some things I can assist you with:",
      options: [
        "Apply for a loan",
        "Check application status",
        "Document requirements",
        "Eligibility criteria",
        "Interest rates & EMI",
        "Speak to an agent"
      ]
    };
  }

  // Thank you
  if (msg.includes('thank') || msg.includes('thanks')) {
    return {
      message: "You're welcome! Is there anything else I can help you with?",
      options: [
        "Apply for loan",
        "Check status",
        "More information",
        "That's all, thanks!"
      ]
    };
  }

  // Default response
  return {
    message: "I understand you need assistance. Let me connect you with our support team for personalized help.",
    options: [
      "Apply for a loan",
      "Check application status",
      "Document requirements",
      "Speak to an agent"
    ]
  };
};
