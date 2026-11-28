import { useState, useEffect } from 'react';
import { Calendar, LogIn, ArrowRight, Check, Users, Smartphone, QrCode, Eye, BarChart2, ChevronRight, Sparkles, ChevronLeft } from 'lucide-react';
import LoginModal from '../components/LoginModal';
import { getPublicAnnouncements } from '../api/announcementApi';

const FALLBACK_ANNOUNCEMENTS = [
  { id: 1, tag: 'Event', text: 'Campus Leadership Summit on April 5, 2026 at the Main Gymnasium' },
  { id: 2, tag: 'Update', text: 'Face enrollment is now open. Visit the Face Enrollment page' },
  { id: 3, tag: 'Info', text: 'U-EventTrack v2 is live! Enjoy all new features' },
];

// Announcement carousel images - Add your images to public/announcements folder
const ANNOUNCEMENT_SLIDES = [
  {
    id: 1,
    image: '/announcements/slide1.png',
    title: 'University Student Government',
    description: 'Mindoro State University - Bongabong Campus official student organization serving the student body',
    tag: 'About USG'
  },
  {
    id: 2,
    image: '/announcements/slide2.png',
    title: 'Student Leadership & Advocacy',
    description: 'Empowering students through programs, events, and initiatives for academic excellence and community development',
    tag: 'Our Mission'
  },
  {
    id: 3,
    image: '/announcements/slide3.png',
    title: 'Join USG Events',
    description: 'Participate in campus activities, seminars, and community programs organized by your student government',
    tag: 'Get Involved'
  },
];

export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [announcements, setAnnouncements] = useState(FALLBACK_ANNOUNCEMENTS);
  const [annIdx, setAnnIdx] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    getPublicAnnouncements()
      .then(res => { if (res.data?.length) setAnnouncements(res.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setAnnIdx(i => (i + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [announcements]);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(i => (i + 1) % ANNOUNCEMENT_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCarouselIndex((carouselIndex + 1) % ANNOUNCEMENT_SLIDES.length);
  };

  const prevSlide = () => {
    setCarouselIndex((carouselIndex - 1 + ANNOUNCEMENT_SLIDES.length) % ANNOUNCEMENT_SLIDES.length);
  };

  const goToSlide = (index) => {
    setCarouselIndex(index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Custom Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cal+Sans:wght@600&display=swap');
        
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }
        
        .font-display { font-family: 'Cal Sans', 'Inter', sans-serif; }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-600 via-green-300 to-white dark:from-green-800 dark:via-green-700 dark:to-gray-900 backdrop-blur-xl border-b border-green-200/50 dark:border-green-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 p-[2px] shadow-lg">
                <div className="w-full h-full rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden p-0.5">
                  <img src="/usg-logo.png" alt="USG" className="w-full h-full object-cover rounded-lg" />
                </div>
              </div>
              <div>
                <div className="font-bold text-base text-gray-900 dark:text-white tracking-tight">U-EventTrack</div>
                <div className="text-[9px] text-gray-700 dark:text-gray-400 font-medium tracking-wide">MinSU BONGABONG</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href="https://expo.dev/artifacts/eas/LiIoOl9NRUujMPUkGXfZDjH0059Hw-Otypgfr6gVwt0.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xs font-bold rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <Smartphone className="w-3.5 h-3.5" />
                Download App
              </a>
              <button 
                onClick={() => setLoginOpen(true)} 
                className="group px-5 py-2 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 text-xs font-bold rounded-full hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-100 dark:hover:to-white transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Logo Left and Carousel Right */}
      <section className="pt-24 pb-6 px-4 lg:px-6 bg-white dark:bg-gray-950 relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-400/20 dark:bg-green-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full blur-3xl" />
        
        <div className="max-w-[1400px] mx-auto relative">
          <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-center">
            {/* Left Side - Logo and Content */}
            <div className="flex flex-col items-center lg:items-start space-y-6 max-w-[450px]">
              {/* Logo Display - Smaller */}
              <div className="w-[220px] h-[220px] lg:w-[260px] lg:h-[260px] rounded-full bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 p-2.5 shadow-2xl">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden p-5">
                  <img 
                    src="/usg-logo.png" 
                    alt="USG Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Content Below Logo */}
              <div className="text-center lg:text-left space-y-4 w-full">
                {/* Headline */}
                <h1 className="font-display text-4xl lg:text-5xl font-semibold text-gray-900 dark:text-white leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                    USG Attendance
                  </span>
                </h1>

                {/* Subheading */}
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  The modern way to track student attendance at campus events with{' '}
                  <span className="text-gray-900 dark:text-white font-semibold">barcode scanning</span>,{' '}
                  <span className="text-gray-900 dark:text-white font-semibold">facial recognition</span>, and{' '}
                  <span className="text-gray-900 dark:text-white font-semibold">real-time analytics</span>.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setLoginOpen(true)}
                    className="group px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
                  >
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="px-5 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-xl">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center lg:text-left">
                      <span className="text-green-600 dark:text-green-400">Students:</span> Download the mobile app to register
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Carousel (2048x1152 aspect ratio = 16:9) */}
            <div className="w-full">
              <div className="relative w-full">
                {/* Main Carousel Container */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <div 
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                  >
                    {ANNOUNCEMENT_SLIDES.map((slide) => (
                      <div key={slide.id} className="min-w-full relative">
                        <div className="relative aspect-[16/9] w-full">
                          {/* Image */}
                          <img 
                            src={slide.image} 
                            alt={slide.title}
                            className="w-full h-full object-contain bg-gray-100 dark:bg-gray-800"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/2048x1152/10b981/ffffff?text=Announcement+Image';
                            }}
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          
                          {/* Content Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 text-white">
                            <div className="inline-block px-3 py-1 bg-green-500 rounded-full text-xs font-bold uppercase tracking-wide mb-3">
                              {slide.tag}
                            </div>
                            <h3 className="text-xl lg:text-3xl font-bold mb-2">{slide.title}</h3>
                            <p className="text-sm lg:text-lg text-gray-200">{slide.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all shadow-lg hover:scale-110"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-white" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all shadow-lg hover:scale-110"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-900 dark:text-white" />
                  </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-4">
                  {ANNOUNCEMENT_SLIDES.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`transition-all duration-300 rounded-full ${
                        index === carouselIndex
                          ? 'w-7 h-2.5 bg-green-600 dark:bg-green-500'
                          : 'w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { value: '3', label: 'Check-in Methods', sublabel: 'Barcode, Face, Mobile' },
              { value: '100%', label: 'Digital Records', sublabel: 'Paperless System' },
              { value: 'Live', label: 'Real-time Updates', sublabel: 'Instant Sync' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-black bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">{stat.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              Features
            </div>
            <h2 className="font-display text-5xl lg:text-6xl font-semibold text-gray-900 dark:text-white mb-6 tracking-tight">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
              Modern tools designed for efficient campus-wide attendance management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <QrCode className="w-7 h-7" />,
                title: 'Barcode Scanning',
                desc: 'Fast and reliable barcode-based check-in for quick student verification at events',
                gradient: 'from-green-500 to-emerald-600',
              },
              {
                icon: <Eye className="w-7 h-7" />,
                title: 'Face Recognition',
                desc: 'Touchless facial recognition attendance for maximum convenience and hygiene',
                gradient: 'from-emerald-500 to-teal-600',
              },
              {
                icon: <Smartphone className="w-7 h-7" />,
                title: 'Mobile App',
                desc: 'Native mobile application for students to check-in and view their attendance',
                gradient: 'from-teal-500 to-cyan-600',
              },
              {
                icon: <BarChart2 className="w-7 h-7" />,
                title: 'Real-time Analytics',
                desc: 'Live dashboards with attendance trends, insights, and detailed reports',
                gradient: 'from-green-500 to-emerald-600',
              },
              {
                icon: <Users className="w-7 h-7" />,
                title: 'Student Management',
                desc: 'Complete student database with course tracking and profile management',
                gradient: 'from-emerald-500 to-teal-600',
              },
              {
                icon: <Calendar className="w-7 h-7" />,
                title: 'Event Management',
                desc: 'Create and manage events with automated attendance tracking and notifications',
                gradient: 'from-teal-500 to-cyan-600',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm hover:shadow-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-transparent transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300" 
                  style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
                
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{feature.desc}</p>
                <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 absolute bottom-8 right-8 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              How It Works
            </div>
            <h2 className="font-display text-5xl lg:text-6xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Get Started in 3 Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Create Event', desc: 'Set up your campus event with date, time, and location details in seconds' },
              { step: '02', title: 'Check-in Students', desc: 'Students scan barcodes, use face recognition, or mobile app to check-in instantly' },
              { step: '03', title: 'Track & Analyze', desc: 'View real-time attendance data and generate comprehensive reports automatically' },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-green-300 dark:from-green-700 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 text-white text-3xl font-black mb-6 shadow-xl relative">
                  {item.step}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 blur-xl opacity-50" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="font-display text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tight">
            Ready to Transform
            <br />
            Your Event Attendance?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-medium">
            Join MinSU Bongabong Campus in modernizing event management with U-EventTrack
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setLoginOpen(true)}
              className="group w-full sm:w-auto px-8 py-4 bg-white text-gray-900 text-lg font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
            >
              Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black dark:bg-gray-950 text-gray-500 dark:text-gray-400 py-12 px-6 lg:px-8 border-t border-gray-900 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-[2px]">
                <div className="w-full h-full rounded-2xl bg-black dark:bg-gray-950 flex items-center justify-center overflow-hidden p-0.5">
                  <img src="/usg-logo.png" alt="USG" className="w-full h-full object-cover rounded-xl" />
                </div>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">U-EventTrack</span>
            </div>
            <p className="text-sm font-medium">Modern attendance tracking for campus events</p>
            <p className="text-sm">© {new Date().getFullYear()} MinSU Bongabong Campus. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal 
        open={loginOpen} 
        onClose={() => setLoginOpen(false)}
      />
    </div>
  );
}
