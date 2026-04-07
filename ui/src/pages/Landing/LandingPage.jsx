import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Library, 
  Binary, 
  Target, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight,
  Quote,
  Star,
  Award,
  Users,
  Building2,
  ChevronRight,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImg from '../../assets/college-hero.png';

// Social Icon mapping (using Material Symbols for these specific ones)
const SocialIcon = ({ name, className }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const SectionHeading = ({ title, subtitle, centered = false }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className={`mb-16 ${centered ? 'text-center' : ''}`}
  >
    <div className={`flex items-center gap-4 mb-4 ${centered ? 'justify-center' : ''}`}>
      <div className="h-0.5 w-12 bg-gold" />
      <span className="text-sm font-black uppercase tracking-[0.2em] text-primary">{subtitle}</span>
    </div>
    <h2 className="text-4xl lg:text-5xl font-black text-navy leading-tight">
      {title}
    </h2>
  </motion.div>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-white shadow-xl py-4' : 'bg-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between gap-8">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-gold shadow-lg">
            <Building2 size={24} />
          </div>
          <h1 className={`text-xl font-black tracking-tight ${scrolled ? 'text-navy' : 'text-navy'}`}>
            Shree Gujrati Samaj
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {['Academics', 'Heritage', 'Admissions', 'Campus Life', 'Research'].map((item) => (
            <a 
              key={item} 
              href="#" 
              className={`text-sm font-bold transition-all hover:text-gold ${
                scrolled ? 'text-slate-600' : 'text-slate-700'
              } ${item === 'Academics' ? 'border-b-2 border-navy text-navy' : ''}`}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6 shrink-0">
          {/* Search Bar matching screenshot */}
          <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-4 py-2 border border-slate-200">
            <Search size={18} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search resources..." 
              className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all"
            />
          </div>
          
          <Link 
            to="/login"
            className="text-sm font-bold text-navy hover:text-gold transition-colors px-4 py-2"
          >
            Login
          </Link>

          <button className="text-sm font-black px-8 py-3.5 rounded-xl bg-navy text-white shadow-xl hover:scale-105 active:scale-95 transition-all">
            Apply Now
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden">
      {/* Background decoration from screenshot */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-slate-50/50 -skew-x-12 translate-x-1/4" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-3 bg-gold/10 px-5 py-2 rounded-lg mb-8 border border-gold/20"
            >
              <span className="text-[10px] sm:text-xs font-black text-orange-800 uppercase tracking-[0.2em]">ESTABLISHED 1954</span>
            </motion.div>
            
            <h1 className="text-7xl lg:text-[105px] font-black text-navy leading-[0.9] mb-10 tracking-tight">
              Heritage <br/>Meets <br/>
              <span className="text-orange-900 italic font-serif font-extrabold tracking-normal">Innovation</span>
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl mb-12 font-medium">
              Empowering the next generation of leaders through a synthesis of traditional 
              Gujarati values and cutting-edge digital pedagogy. Join the legacy of 
              excellence at Shree Gujrati Samaj College.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link
                to="/login"
                className="w-full sm:w-auto px-10 py-5 rounded-xl bg-navy text-white font-black text-sm shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 group"
              >
                Explore Programs
              </Link>
              <button className="w-full sm:w-auto px-10 py-5 rounded-xl border-2 border-slate-200 text-navy font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center">
                Virtual Tour
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 rounded-[48px] overflow-hidden shadow-2xl">
              <img src={heroImg} alt="Digital Campus Illustration" className="w-full h-auto object-cover" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Ecosystem = () => {
  const features = [
    { 
      title: 'Resource Library', 
      desc: 'Access over 500,000 digital volumes, research papers, and archived lectures from anywhere in the world.',
      icon: <SocialIcon name="menu_book" className="text-primary text-[28px]" />,
      color: 'bg-blue-50'
    },
    { 
      title: 'AI Test Taking', 
      desc: 'Adaptive assessment modules that personalize the testing experience to help students identify and master weak points.',
      icon: <SocialIcon name="psychology" className="text-orange-600 text-[28px]" />,
      color: 'bg-orange-50'
    },
    { 
      title: 'Admin Flows', 
      desc: 'Automated enrollment, fee management, and departmental approvals at the touch of a button.',
      icon: <SocialIcon name="account_tree" className="text-rose-600 text-[28px]" />,
      color: 'bg-rose-50'
    }
  ];

  return (
    <section className="py-32 bg-[#F2F4F7] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-20">
          <h2 className="text-5xl font-black text-navy mb-6">The Digital Campus Ecosystem</h2>
          <p className="text-slate-600 text-lg font-medium">
            Our integrated platform streamlines every aspect of academic life, 
            from resource access to administrative efficiency.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-12 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="text-2xl font-black text-navy mb-5">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Pagination Dots from screenshot */}
        <div className="mt-16 flex items-center justify-end gap-3 px-4">
          <div className="w-8 h-1.5 bg-orange-800 rounded-full" />
          <div className="w-3 h-1.5 bg-slate-300 rounded-full" />
        </div>
      </div>
    </section>
  );
};

const LegacySection = () => {
  return (
    <section className="py-32 bg-white flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[40px] overflow-hidden shadow-xl"
          >
            <img src={heroImg} className="w-full h-auto" alt="College Building Actual Photo" />
          </motion.div>

          <div>
            <h2 className="text-5xl font-black text-navy mb-10">A Legacy of Wisdom</h2>
            <div className="space-y-6 text-slate-600 font-medium text-lg leading-relaxed mb-12">
              <p>
                Founded on the principles of community and enlightenment, Shree Gujrati Samaj 
                College has stood as a pillar of academic excellence for over seven decades.
              </p>
              <p>
                From our humble beginnings as a local study center, we have evolved into a 
                premier institution that preserves the rich cultural heritage of Gujarat while 
                aggressively adopting the technological shifts of the 21st century.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-10">
              <div>
                <p className="text-5xl font-black text-navy mb-1 tracking-tighter">70+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Years of Heritage</p>
              </div>
              <div>
                <p className="text-5xl font-black text-navy mb-1 tracking-tighter">25k+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Alumni</p>
              </div>
            </div>

            <a href="#" className="inline-flex items-center gap-2 text-sm font-black text-navy border-b-2 border-navy pb-1 hover:text-gold hover:border-gold transition-all">
              View Historical Timeline
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-navy pt-32 pb-12 overflow-hidden relative text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-navy shadow-lg">
                <Building2 size={24} />
              </div>
              <h1 className="text-xl font-black tracking-tight text-white italic">SGS College</h1>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
              A premier institution dedicated to academic excellence, innovative research, 
              and holistic student development.
            </p>
            <div className="flex items-center gap-4">
              {['facebook', 'public', 'account_box', 'language'].map((icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 hover:bg-gold hover:text-navy transition-all">
                  <SocialIcon name={icon} className="text-[20px]" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-10 text-gold">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/login" className="text-slate-400 font-medium text-sm hover:text-white transition-all">Student/Teacher Login</Link></li>
              {['Academic Calendar', 'Research Portal', 'Alumni Network', 'Career Center'].map(link => (
                <li key={link}><a href="#" className="text-slate-400 font-medium text-sm hover:text-white transition-all">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-10 text-gold">Resources</h4>
            <ul className="space-y-4">
              {['Student Handbook', 'Privacy Policy', 'Code of Conduct', 'Media Assets'].map(link => (
                <li key={link}><a href="#" className="text-slate-400 font-medium text-sm hover:text-white transition-all">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-10 text-gold">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin size={18} className="text-gold mt-1" />
                <p className="text-slate-400 text-sm font-medium leading-relaxed">Indore, Madhya Pradesh</p>
              </li>
              <li className="flex items-start gap-4">
                <Phone size={18} className="text-gold" />
                <p className="text-slate-400 text-sm font-medium">+91 731 234 5678</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
            © 2026 Shree Gujrati Samaj College. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen selection:bg-gold selection:text-navy font-sans">
      <Navbar />
      <Hero />
      <Ecosystem />
      <LegacySection />
      <Footer />
    </div>
  );
};

export default LandingPage;
