import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaFileContract, FaGavel, FaShieldAlt, FaRobot, FaExclamationTriangle } from "react-icons/fa";

const TermsOfService = () => {
  const contentRef = useRef(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-primary to-secondary pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div ref={contentRef} className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <FaFileContract className="text-6xl text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              These terms govern your use of Conbyt's AI automation services and solutions.
            </p>
            <div className="text-sm text-muted mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Content */}
          <div className="bg-surface/60 rounded-2xl p-8 shadow-xl">
            
            {/* Agreement */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4 flex items-center gap-3">
                <FaGavel className="text-accent" />
                Agreement to Terms
              </h2>
              <p className="text-muted leading-relaxed">
                By accessing or using Conbyt's services, you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access our services. These terms apply to all users, customers, and visitors of our website and services.
              </p>
            </section>

            {/* Service Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4 flex items-center gap-3">
                <FaRobot className="text-accent" />
                Service Description
              </h2>
              
              <div className="space-y-4">
                <p className="text-muted leading-relaxed">
                  Conbyt provides AI automation services including but not limited to:
                </p>
                
                <ul className="text-muted space-y-2 ml-4">
                  <li>• AI-powered automation solutions</li>
                  <li>• Machine learning model development</li>
                  <li>• Conversational AI and chatbots</li>
                  <li>• Generative AI content creation</li>
                  <li>• AI product development and consulting</li>
                  <li>• MVP development for AI applications</li>
                  <li>• Technical support and maintenance</li>
                </ul>
              </div>
            </section>

            {/* User Accounts */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4">User Accounts and Registration</h2>
              
              <div className="space-y-4">
                <p className="text-muted leading-relaxed">
                  When you create an account with us, you must provide accurate and complete information. You are responsible for:
                </p>
                
                <ul className="text-muted space-y-2 ml-4">
                  <li>• Maintaining the security of your account credentials</li>
                  <li>• All activities that occur under your account</li>
                  <li>• Notifying us immediately of any unauthorized use</li>
                  <li>• Ensuring your account information remains current</li>
                  <li>• Complying with all applicable laws and regulations</li>
                </ul>
              </div>
            </section>

            {/* Acceptable Use */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4 flex items-center gap-3">
                <FaExclamationTriangle className="text-accent" />
                Acceptable Use Policy
              </h2>
              
              <div className="space-y-4">
                <p className="text-muted leading-relaxed">
                  You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:
                </p>
                
                <ul className="text-muted space-y-2 ml-4">
                  <li>• Use our services for any illegal or unauthorized purpose</li>
                  <li>• Violate any applicable laws or regulations</li>
                  <li>• Infringe upon intellectual property rights</li>
                  <li>• Transmit harmful, offensive, or inappropriate content</li>
                  <li>• Attempt to gain unauthorized access to our systems</li>
                  <li>• Interfere with or disrupt our services</li>
                  <li>• Use our AI services to generate harmful or misleading content</li>
                  <li>• Reverse engineer or attempt to extract our proprietary algorithms</li>
                </ul>
              </div>
            </section>

            {/* AI-Specific Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4">AI Service Terms</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-text mb-2">Data Processing</h3>
                  <ul className="text-muted space-y-2 ml-4">
                    <li>• You retain ownership of your data</li>
                    <li>• We process data only as necessary to provide services</li>
                    <li>• AI models may be trained on anonymized data</li>
                    <li>• You are responsible for data you provide to our AI systems</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-text mb-2">AI Output and Liability</h3>
                  <ul className="text-muted space-y-2 ml-4">
                    <li>• AI-generated content should be reviewed before use</li>
                    <li>• We are not liable for AI-generated content accuracy</li>
                    <li>• You are responsible for AI output compliance with laws</li>
                    <li>• AI systems may have limitations and biases</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-text mb-2">Model Training and Improvement</h3>
                  <ul className="text-muted space-y-2 ml-4">
                    <li>• We may use anonymized data to improve our AI models</li>
                    <li>• Your proprietary data will not be used without consent</li>
                    <li>• Model improvements benefit all users</li>
                    <li>• You can opt out of data usage for training</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4">Payment and Billing</h2>
              
              <div className="space-y-4">
                <p className="text-muted leading-relaxed">
                  Payment terms for our services:
                </p>
                
                <ul className="text-muted space-y-2 ml-4">
                  <li>• Fees are billed in advance for subscription services</li>
                  <li>• Project-based services require milestone payments</li>
                  <li>• Late payments may result in service suspension</li>
                  <li>• All fees are non-refundable unless otherwise specified</li>
                  <li>• Prices may change with 30 days notice</li>
                  <li>• Taxes are additional where applicable</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4">Intellectual Property</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-text mb-2">Our Rights</h3>
                  <ul className="text-muted space-y-2 ml-4">
                    <li>• We retain ownership of our AI algorithms and technology</li>
                    <li>• Our brand, logo, and website content are protected</li>
                    <li>• We own improvements to our AI models and systems</li>
                    <li>• Open-source components retain their original licenses</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-text mb-2">Your Rights</h3>
                  <ul className="text-muted space-y-2 ml-4">
                    <li>• You retain ownership of your data and content</li>
                    <li>• Custom solutions developed for you are yours</li>
                    <li>• You can use AI outputs for your business purposes</li>
                    <li>• Your intellectual property remains protected</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Service Level Agreement */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4">Service Level Agreement</h2>
              
              <div className="space-y-4">
                <p className="text-muted leading-relaxed">
                  Our commitment to service quality:
                </p>
                
                <ul className="text-muted space-y-2 ml-4">
                  <li>• 99.9% uptime for hosted AI services</li>
                  <li>• 24/7 monitoring and support</li>
                  <li>• Regular security updates and maintenance</li>
                  <li>• Performance optimization and scaling</li>
                  <li>• Backup and disaster recovery procedures</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4">Limitation of Liability</h2>
              
              <div className="space-y-4">
                <p className="text-muted leading-relaxed">
                  To the maximum extent permitted by law:
                </p>
                
                <ul className="text-muted space-y-2 ml-4">
                  <li>• We are not liable for indirect, incidental, or consequential damages</li>
                  <li>• Our total liability is limited to amounts paid for services</li>
                  <li>• We are not responsible for AI-generated content accuracy</li>
                  <li>• We disclaim warranties for AI system performance</li>
                  <li>• Force majeure events may affect service availability</li>
                </ul>
              </div>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4">Termination</h2>
              
              <div className="space-y-4">
                <p className="text-muted leading-relaxed">
                  Either party may terminate this agreement:
                </p>
                
                <ul className="text-muted space-y-2 ml-4">
                  <li>• With 30 days written notice</li>
                  <li>• Immediately for material breach of terms</li>
                  <li>• Upon non-payment of fees</li>
                  <li>• For violation of acceptable use policy</li>
                  <li>• Upon service discontinuation</li>
                </ul>
              </div>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4">Governing Law</h2>
              
              <p className="text-muted leading-relaxed">
                These Terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved through binding arbitration in accordance with the rules of [Arbitration Organization]. Both parties agree to submit to the jurisdiction of the courts in [Your Jurisdiction].
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4">Changes to Terms</h2>
              
              <p className="text-muted leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or website notice. Your continued use of our services after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <p className="text-muted leading-relaxed">
                  If you have questions about these Terms of Service, please contact us:
                </p>
                
                <div className="bg-accent/10 rounded-lg p-4">
                  <p className="text-text font-medium">Conbyt Legal Department</p>
                  <p className="text-muted">Email: legal@conbyt.com</p>
                  <p className="text-muted">Address: [Your Business Address]</p>
                </div>
              </div>
            </section>

            {/* Back to Home */}
            <div className="text-center mt-12">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-surface px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 