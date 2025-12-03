import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaUserLock, FaDatabase, FaEye, FaCog } from "react-icons/fa";

const PrivacyPolicy = () => {
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
              <FaShieldAlt className="text-6xl text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Your privacy is fundamental to our AI-driven services. This policy explains how we collect, use, and protect your data.
            </p>
            <div className="text-sm text-muted mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Content */}
          <div className="bg-surface/60 rounded-2xl p-8 shadow-xl">
            
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4 flex items-center gap-3">
                <FaUserLock className="text-accent" />
                Introduction
              </h2>
              <p className="text-muted leading-relaxed">
                Conbyt ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI automation services, including our website, applications, and AI-powered solutions.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4 flex items-center gap-3">
                <FaDatabase className="text-accent" />
                Information We Collect
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-text mb-2">Personal Information</h3>
                  <ul className="text-muted space-y-2 ml-4">
                    <li>• Name, email address, and contact information</li>
                    <li>• Company information and job title</li>
                    <li>• Payment and billing information</li>
                    <li>• Communication preferences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-text mb-2">AI Processing Data</h3>
                  <ul className="text-muted space-y-2 ml-4">
                    <li>• Data provided for AI automation services</li>
                    <li>• Training data for machine learning models</li>
                    <li>• Usage patterns and interaction data</li>
                    <li>• Performance metrics and analytics</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-text mb-2">Technical Information</h3>
                  <ul className="text-muted space-y-2 ml-4">
                    <li>• IP address and device information</li>
                    <li>• Browser type and version</li>
                    <li>• Operating system and platform</li>
                    <li>• Usage analytics and cookies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4 flex items-center gap-3">
                <FaCog className="text-accent" />
                How We Use Your Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-text mb-2">Service Delivery</h3>
                  <ul className="text-muted space-y-2 ml-4">
                    <li>• Provide and maintain our AI services</li>
                    <li>• Process automation requests and workflows</li>
                    <li>• Improve AI model performance and accuracy</li>
                    <li>• Deliver personalized experiences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-text mb-2">Communication</h3>
                  <ul className="text-muted space-y-2 ml-4">
                    <li>• Respond to inquiries and support requests</li>
                    <li>• Send service updates and notifications</li>
                    <li>• Provide technical support and assistance</li>
                    <li>• Share relevant product information</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-text mb-2">Analytics & Improvement</h3>
                  <ul className="text-muted space-y-2 ml-4">
                    <li>• Analyze usage patterns and trends</li>
                    <li>• Improve our AI algorithms and services</li>
                    <li>• Develop new features and capabilities</li>
                    <li>• Ensure security and prevent fraud</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* AI and Machine Learning */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4 flex items-center gap-3">
                <FaCog className="text-accent" />
                AI and Machine Learning
              </h2>
              
              <div className="space-y-4">
                <p className="text-muted leading-relaxed">
                  Our AI services may process your data to provide automation, insights, and intelligent solutions. We ensure:
                </p>
                
                <ul className="text-muted space-y-2 ml-4">
                  <li>• Data is processed securely and ethically</li>
                  <li>• AI models are trained responsibly</li>
                  <li>• No personal information is used without consent</li>
                  <li>• Automated decisions are transparent and explainable</li>
                  <li>• You have control over AI processing of your data</li>
                </ul>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4">Data Sharing and Disclosure</h2>
              
              <div className="space-y-4">
                <p className="text-muted leading-relaxed">
                  We do not sell, trade, or rent your personal information. We may share data only in these circumstances:
                </p>
                
                <ul className="text-muted space-y-2 ml-4">
                  <li>• With your explicit consent</li>
                  <li>• To comply with legal obligations</li>
                  <li>• With trusted service providers (under strict agreements)</li>
                  <li>• To protect our rights and safety</li>
                  <li>• In business transfers (with privacy protections)</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4">Data Security</h2>
              
              <div className="space-y-4">
                <p className="text-muted leading-relaxed">
                  We implement industry-standard security measures to protect your data:
                </p>
                
                <ul className="text-muted space-y-2 ml-4">
                  <li>• Encryption in transit and at rest</li>
                  <li>• Regular security audits and assessments</li>
                  <li>• Access controls and authentication</li>
                  <li>• Secure data centers and infrastructure</li>
                  <li>• Employee training on data protection</li>
                </ul>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4">Your Rights</h2>
              
              <div className="space-y-4">
                <p className="text-muted leading-relaxed">
                  You have the following rights regarding your personal data:
                </p>
                
                <ul className="text-muted space-y-2 ml-4">
                  <li>• Access and review your data</li>
                  <li>• Correct inaccurate information</li>
                  <li>• Request deletion of your data</li>
                  <li>• Restrict processing of your data</li>
                  <li>• Data portability</li>
                  <li>• Object to processing</li>
                  <li>• Withdraw consent</li>
                </ul>
              </div>
            </section>

            {/* GDPR Compliance */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4">GDPR Compliance</h2>
              
              <div className="space-y-4">
                <p className="text-muted leading-relaxed">
                  For users in the European Union, we comply with the General Data Protection Regulation (GDPR):
                </p>
                
                <ul className="text-muted space-y-2 ml-4">
                  <li>• Legal basis for processing is clearly defined</li>
                  <li>• Data retention periods are specified</li>
                  <li>• Cross-border transfers are protected</li>
                  <li>• Data Protection Officer contact available</li>
                  <li>• Right to lodge complaints with authorities</li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4">Contact Us</h2>
              
              <div className="space-y-4">
                <p className="text-muted leading-relaxed">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                
                <div className="bg-accent/10 rounded-lg p-4">
                  <p className="text-text font-medium">Conbyt Data Protection Officer</p>
                  <p className="text-muted">Email: privacy@conbyt.com</p>
                  <p className="text-muted">Address: [Your Business Address]</p>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text mb-4">Updates to This Policy</h2>
              
              <p className="text-muted leading-relaxed">
                We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>
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

export default PrivacyPolicy; 