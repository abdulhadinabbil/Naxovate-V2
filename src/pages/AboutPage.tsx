import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">About the Founder</h1>
          <p className="text-gray-600">Learn more about the person behind NaxoVate</p>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            {/* Founder Image */}
            <div className="md:w-1/3 mb-6 md:mb-0 md:pr-8">
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://pbs.twimg.com/media/GW0cm4IWUAA_Y8W?format=jpg&name=large" 
                  alt="Abdul Hadi Nabil" 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="mt-6 flex justify-center space-x-4">
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition">
                  <Github className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition">
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Founder Bio */}
            <div className="md:w-2/3">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Abdul Hadi Nabil</h2>
              <p className="text-gray-700 mb-4">
                Abdul Hadi Nabil is a passionate technologist and innovator from Sylhet, Bangladesh. 
                As a Computer Science and Engineering graduate from Metropolitan University, he has 
                dedicated his career to creating solutions that empower people through technology.
              </p>
              
              <p className="text-gray-700 mb-4">
                Currently working as an Azure Administrator, Abdul brings extensive experience in 
                cloud computing, software development, and system architecture. His expertise spans 
                across multiple domains including web development, database management, and artificial 
                intelligence.
              </p>
              
              <p className="text-gray-700 mb-4">
                The idea for NaxoVate came from Abdul's desire to create a platform that combines 
                file management, social networking, and AI capabilities in one seamless experience. 
                His vision is to build a community where users can collaborate, share ideas, and 
                leverage cutting-edge technology to enhance their creativity and productivity.
              </p>
              
              <p className="text-gray-700 mb-4">
                Beyond his technical skills, Abdul is known for his problem-solving abilities, 
                attention to detail, and commitment to user-centered design. He believes that 
                technology should be accessible, intuitive, and beneficial for everyone.
              </p>
              
              <p className="text-gray-700">
                When not coding or brainstorming new features for NaxoVate, Abdul enjoys exploring 
                emerging technologies, contributing to open-source projects, and mentoring aspiring 
                developers in his community.
              </p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
                  <p className="text-gray-700">BSc in Computer Science and Engineering</p>
                  <p className="text-gray-600">Metropolitan University, Sylhet</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Current Role</h3>
                  <p className="text-gray-700">Azure Administrator</p>
                  <p className="text-gray-600">Cloud Solutions Inc.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vision and Mission */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Vision & Mission</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="font-semibold text-indigo-700 mb-3">Our Vision</h3>
                <p className="text-gray-700">
                  To create a world where technology empowers individuals to connect, create, and 
                  collaborate without boundaries, fostering innovation and personal growth.
                </p>
              </div>
              
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="font-semibold text-indigo-700 mb-3">Our Mission</h3>
                <p className="text-gray-700">
                  To provide a comprehensive platform that combines secure file management, meaningful 
                  social connections, and cutting-edge AI tools, enabling users to express their 
                  creativity and achieve their goals.
                </p>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Core Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-700">
                  We constantly push the boundaries of what's possible, embracing new technologies 
                  and ideas to create better solutions.
                </p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">User-Centered</h3>
                <p className="text-gray-700">
                  We put our users first, designing intuitive experiences that address real needs 
                  and solve meaningful problems.
                </p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Integrity</h3>
                <p className="text-gray-700">
                  We operate with transparency, honesty, and respect for user privacy and data security.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-700 mb-4">
              Have questions, suggestions, or just want to say hello? We'd love to hear from you!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                <p className="text-gray-700">Email: contact@naxovate.com</p>
                <p className="text-gray-700">Phone: +880 179 505 3988</p>
                <p className="text-gray-700">Location: Sylhet, Bangladesh</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Follow Us</h3>
                <p className="text-gray-700">
                  Stay updated with our latest features and announcements by following us on social media.
                </p>
                <div className="mt-2 flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-indigo-600 transition">
                    <Github className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-indigo-600 transition">
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-indigo-600 transition">
                    <Linkedin className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;