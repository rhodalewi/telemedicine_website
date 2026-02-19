import { Link } from 'react-scroll'
import { useState, useEffect } from "react";
import { motion as Motion } from 'framer-motion';
import Countup from 'react-countup';

import { GiMedicalPack, GiHeartBeats, GiBrain, GiKidneys  } from "react-icons/gi";
import { LuArrowRight, LuCalendar, LuClock, LuUsers, LuShield, LuMapPin, LuHeart, LuMenu, LuCircleX } from "react-icons/lu";
import { FaHeart, FaChild, FaBone, FaTooth, FaFemale, FaEye, FaAssistiveListeningSystems, FaStethoscope, FaHandHoldingMedical } from "react-icons/fa";
import AuthModal from '../Modals/AuthModal';


const navLinks = [
    {id: 1, href: 'home', name:'Home' },
    {id: 2, href: 'features', name:'Features' },
    {id: 3, href: 'howitworks', name:'How it works' },
    {id: 4, href: 'services', name:'Services' },
    {id: 5, href: 'testimonial', name:'Testimonials' }
]

const features = [
    { icon: <LuCalendar />, title: 'Easy Booking', description: 'Schedule appointments with your preferred doctors in just a few clicks', color: 'bg-blue-100 text-blue-600' },
    { icon: <LuClock />, title: 'Available 24/7', description: 'Access medical professionals whenever you need them', color: 'bg-orange-100 text-orange-600' },
    { icon: <LuUsers />, title: 'Expert Doctors', description: 'Access to experienced healthcare professionals across various specialties', color: 'bg-indigo-100 text-indigo-600' },
    { icon: <LuShield />, title: 'Secure & Private', description: 'All consultations and data are encrypted, ensuring privacy and security.', color: 'bg-green-100 text-green-600' },
    { icon: <LuMapPin />, title: 'Multiple Locations', description: 'Find our healthcare facilities near you with integrated maps', color: 'bg-purple-200 text-purple-600' },
    { icon: <LuHeart />, title: 'Affordable Care', description: 'Enjoy cost-effective medical services', color: 'bg-red-100 text-red-600' },
]

const services = [
    {icon: <FaHeart />, title: 'Cardiology'}, {icon: <FaHandHoldingMedical />, title: 'Dermatology'}, {icon: <FaChild />, title: 'Pediatrics'}, {icon: <FaBone />, title: 'Orthopedics'}, {icon: <GiBrain />, title: 'Neurology'}, {icon: <FaStethoscope  />, title: 'General Medicine'}, {icon: <GiBrain />, title: 'Psychiatry'}, {icon: <FaTooth  />, title: 'Dentistry'}, {icon: <FaFemale />, title: 'Gynecology'}, {icon: <FaEye />, title: 'Ophthalmology'}, {icon: <FaAssistiveListeningSystems  />, title: 'ENT'}, {icon: <GiKidneys  />, title: 'Urology'},
]

const steps = [
     {step: '01', title: 'Create Your Account', description: 'Sign up and complete your profile with medical history and preferences', type: 'odd'},
     {step: '02', title: 'Find Your Doctor', description: 'Browse our network of specialists and choose the right doctor for you', type: 'even'},
     {step: '03', title: 'Book an Appointment', description: 'Choose a convenient time and date for your appointment', type: 'odd'},
     {step: '04', title: 'Consult Online', description: 'Join a virtual consultation with your healthcare provider.', type: 'even'}
]

const testimonials = [
    {id: 1, name: 'Micheal T.', role: 'Satisfied Patient', content: "TeleMedi has been a lifesaver for me. I'm a busy professional, and it's often difficult to find time for in-person doctor visits. With TeleMedi, I can consult with doctors from the comfort of my home, saving me time and hassle. The platform is user-friendly and the doctors are incredibly knowledgeable and helpful.", avatar: '/img/avatar-1.png'},
    {id: 2, name: 'Sarah Johnson', role: 'Caring Parent', content: "As a parent of young children, I'm always worried about their health. TeleMedi has made it so much easier to get medical advice quickly and easily. The doctors are patient and take the time to answer all my questions. I'm grateful for this service.", avatar: '/img/avatar-2.png'},
    {id: 3, name: 'Christopher Smith', role: 'Happy User', content: "I was initially hesitant about virtual consultations, but TeleMedi changed my mind. The quality of care I received was excellent, and the convenience was unmatched. I highly recommend TeleMedi to anyone looking for a reliable and efficient healthcare solution.", avatar: '/img/avatar-3.png'}
]


const LandingPage = () => {
    const [current, setCurrent] = useState(0);
    const [touchStartX, setTouchStartX] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [openAuth, setOpenAuth] = useState(false);
    const [formType, setFormType] = useState('login');


    const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
    }
    
    const handleNext = () => {
        setCurrent((prevCurrent) => (prevCurrent === testimonials.length - 1 ? 0 : prevCurrent + 1))
    }

    useEffect(() => {
        //Pause on hover
        if (isPaused) return 

        const interval = setInterval(() => {
            setCurrent((prevCurrent) => (prevCurrent === testimonials.length - 1 ? 0 : prevCurrent + 1));
        }, 3000);
        
        return () => clearInterval(interval);

    }, [isPaused]);

    useEffect(() => {
        window.scrollTo({ top: 0.2, behavior: 'smooth' })
          
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

     //swipe for mobile
    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
        setIsPaused(true);
    }

    const handleTouchEnd = (e) => {
        if (touchStartX - e.changedTouches[0].clientX > 50) handleNext();
        if (touchStartX - e.changedTouches[0].clientX < -50) setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
        setIsPaused(false);
    };

    const handleDotClick = (index) => {
        setCurrent(index);
    }

    const Year = new Date().getFullYear();

  return (
    <div className="overflow-hidden relative">
        {/* HERO SECTION */}
        <div className=''>
            {/* HEADER */}
            <header className={`fixed w-full top-0 py-3.5 border-b border-gray-200 z-20 bg-background ${ isScrolled ? 'md:bg-white/80 md:backdrop-blur-md group shadow-soft  border-none'  : ''}`}>
                <div className="max-w-[90%] mx-auto flex items-center justify-between">
                      {/* LOGO */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center">
                            <GiMedicalPack className="md:text-xl text-white"/>
                        </div>
                        <p className="text-lg md:text-h3 font-semibold font-heading">MediCare</p>
                    </div>
                        {/* NAVIGATION LINKS */}
                    <nav className={`hidden lg:flex items-center justify-center gap-7 ${isScrolled ? 'group text-primary' : ''}`}>
                        {navLinks.map(links => (
                            <Link
                                key={links.id}
                                to={links.href.replace('#', '')}
                                smooth={true}
                                spy={true}
                                duration={700}
                                offset={-70}
                                activeClass='text-primary border-b-3 border-primary rounded-b-md'
                                className={`text-body pb-1.5 hover:text-primary hover:border-b-3 border-primary rounded-b-md transition-all duration-500 ease-in-out cursor-pointer ${isScrolled ? 'hover:text-text-primary hover:border-text-secondary' : ''}`}
                            >
                                {links.name}
                            </Link>
                        ))}
                    </nav>
                    
                    {/* BUTTONS */}
                    <div className="hidden lg:flex items-center justify-center space-x-4 font-heading">
                        <button 
                            className="text-small py-2 px-4 rounded-xl font-semibold hover:bg-accent hover:text-white transition-all duration-500 ease-in-out shadow-soft cursor-pointer"
                            onClick={() => {
                                setOpenAuth(true)
                                setFormType('login')
                            }}
                        >
                            Sign In
                        </button>
                        
                        <button 
                            className="text-small font-semibold py-2 px-4 rounded-xl bg-primary text-white hover:bg-primary-hover hover:shadow-soft transition-all duration-500 ease-in-out cursor-pointer"
                            onClick={() => {
                                setOpenAuth(true)
                                setFormType('register')
                            }}
                        >
                            Get Started
                        </button>
                    </div>
                    
                    {/* Open Sidebar for mobile */}
                    <button 
                        className=' lg:hidden text-h3 md:text-h1 focus:outline-none' 
                        aria-expanded={isOpen}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <LuCircleX className='hover:text-accent-hover'/> : <LuMenu className='hover:text-accent-hover' />}
                    </button>
                </div>
                
                  {/* MOBILE SIDEBAR */}
                <div className={`h-screen right-0 absolute top-full lg:hidden transition-colors ${isOpen ? 'bg-text-primary/60 duration-700 ease-in-out' : ''}`}>
                    <div 
                        className={`absolute right-0 w-64 h-screen bg-background p-8 transform transition-all duration-700 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} 
                        onClick={() => setIsOpen(false)}
                    >
                        <nav className='flex flex-col gap-2'>
                            {navLinks.map(link => (
                                <Link
                                    key={link.id}
                                    to={link.href.replace('#', '')}
                                    smooth={true}
                                    spy={true}
                                    duration={700}
                                    offset={-70}
                                    activeClass='text-primary'
                                    onClick={() => setIsOpen(false)}
                                    className='py-1 text-body font-heading font-medium hover:text-primary-hover cursor-pointer transition-all duration-500 ease-in-out'
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                            {/* Buttons */}
                        <div className='border-t border-primary/30 mt-8 pt-8 flex flex-col items-center gap-4 font-heading'>
                            <button 
                                type='button' 
                                onClick={() => {
                                    setOpenAuth(true)
                                    setFormType('login')
                                }}
                                className="py-2 px-4 rounded-xl font-semibold focus:bg-accent focus:text-white transition-all duration-500 ease-in-out focus:shadow-soft text-small"
                            >
                                Sign In
                            </button>
                            
                            <button 
                                type='button' 
                                onClick={() => {
                                    setOpenAuth(true)
                                    setFormType('register')
                                }}
                                className="text-small font-semibold py-2 px-4 rounded-xl bg-primary text-white focus:bg-accent focus:shadow-soft transition-all duration-500 ease-in-out"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            
            {/* HERO SECTION */}
            <section id="home" className=" bg-[url(/img/hero-background.png)] bg-cover bg-center bg-no-repeat text-background overflow-hidden">
                <div className="bg-[rgba(87,87,87,0.72)] px-4 sm:px-10 lg:px-20 pt-24 pb-10 xl:pt-24 2xl:pt-4 lg:h-170 grid lg:grid-cols-2 items-center justify-center">
                    <div className="flex flex-col w-full">
                        <div className="px-4 py-2 rounded-full bg-primary/60 flex items-center self-start gap-2 mb-8">
                            <p className="text-sm font-medium">Welcome to MediCare</p>
                            <GiHeartBeats  className="text-body md:text-lg font-medium" />
                        </div>
                        
                        <h1 className="text-h3 sm:text-h2 md:text-h1 lg:text-4xl md:leading-12 text-balance font-bold mb-3 md:mb-6 font-heading">
                            Connect with Top Healthcare Professionals from the comfort of your home fast and seamlessly
                        </h1>
                            
                        <p className="mb-8 text-small sm:text-body">Your all-in-one platform for virtual healthcare services.</p>
                            
                        <button 
                            onClick={() => {
                                setOpenAuth(true)
                                setFormType('register')
                            }}
                            
                            className="text-sm md:text-base font-semibold py-2.5 px-3.5 rounded-xl bg-primary text-white hover:bg-primary-hover hover:shadow-soft transition-all duration-500 ease-in-out flex items-center gap-1 self-start cursor-pointer"
                        >
                            Book Appointment
                            <LuArrowRight className="text-xl" />
                        </button>
                            
                        {/* statistics */}
                        <div className="flex items-center gap-7 justify-center sm:gap-12 mt-10 pt-10 sm:pt-12  border-t border-gray-400 text-center">
                            <div className="flex flex-col items-center justify-center gap-1 ">
                                <Countup end={20} duration={4} prefix='' suffix='k+' className="sm:text-h3/relaxed font-semibold font-heading" />
                                <p className="text-white/84 text-caption sm:text-small">Satisfied Patients</p>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-1 ">
                                <Countup end={40} duration={4} prefix='' suffix='+' className="sm:text-h3/relaxed font-semibold font-heading" /> 
                                <p className="text-white/84 text-caption sm:text-small">Experienced Doctors</p>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-1 ">
                                <Countup end={94} duration={4} prefix='' suffix='%' className="sm:text-h3/relaxed font-semibold font-heading" /> 
                                <p className="text-white/84 text-caption sm:text-small">Positive Reviews</p>
                            </div>  
                        </div>
                    </div>
                
                    {/* doctor image */}
                    <div className=" h-[84%] opacity-80 hidden lg:inline-block">
                        <img src="/img/hero-doctor.png" alt="Healthcare professionals" className="object-cover w-full h-auto"/>
                    </div>
                </div>
            </section>
        </div>
          
          {/* FEATURES */}
        <section id="features" className="py-12 sm:py-14 lg:py-20 px-4 sm:px-10 lg:px-18 bg-background">
           <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 lg:space-y-16">
                <h1 className="text-h3 md:text-h2 font-semibold text-center font-heading">Why Choose MediCare?</h1>
            
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 place-content-center">
                    {features.map((feature, index) => (
                            <div key={index} className="bg-gray-100 rounded-xl p-6 hover:shadow-soft transition-all duration-300 ease-in">
                                <div className={`mb-4 flex justify-center items-center rounded-full w-11 h-11 md:w-14 md:h-14 ${feature.color}`}>
                                    <span className="text-h3 md:text-h2"> {feature.icon} </span>
                                </div>

                                <h3 className="mb-2 font-bold font-heading"> {feature.title} </h3>
                                <p className="text-small"> {feature.description} </p>
                            </div>
                        )
                    )}
                </div>
           </div>
        </section>
        
          {/* SERVICES */}
        <section id="services" className="py-12 sm:py-14 lg:py-20 px-4 sm:px-10 lg:px-18 bg-accent/10">
            <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 lg:space-y-16">
                <h1 className="text-h3 md:text-h2 font-semibold text-center font-heading"> Our Medical Services</h1>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-x-6 lg:gap-y-12 place-content-center ">
                    {services.map((service, index) => (
                        <div key={index} className="flex flex-col items-center justify-center gap-6 p-6 text-center bg-background rounded-xl">
                            <div className="w-12 h-12 flex justify-center items-center rounded-full bg-primary/86">
                                <span className="text-white text-h2"> {service.icon} </span>
                            </div>
                            <p> {service.title} </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
          {/* HOW IT WORKS */}
        <section id="howitworks" className="py-12 sm:py-14 lg:py-20 px-4 sm:px-10 lg:px-18 bg-background">
            <div className="text-center space-y-8 sm:space-y-12 lg:space-y-16">
                <div className="space-y-2 sm:space-y-3 text-center">
                    <h1 className="text-h3 md:text-h2 font-semibold font-heading">How It Works</h1>
                    <p className="text-text-secondary text-small sm:text-body">Get started with MediCare in four simple steps:</p>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 place-items-center gap-4 sm:gap-6 lg:gap-12">
                    {steps.map((step, index) => {
                        if (step.type === 'odd') return (
                            <div key={index} className='p-8 bg-primary-hover/10 rounded-3xl flex flex-col items-center border border-primary'>
                                <h2 className="bg-primary text-white w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-h3 sm:text-h2 font-semibold mb-8 shadow-[4px_8px_12px_0px_rgba(0,109,111,0.32)]"> {step.step} </h2>
                                <h1 className="font-bold text-body mb-2 font-heading"> {step.title} </h1>
                                <p className="text-caption"> {step.description} </p>
                            </div>
                        )

                        if (step.type === 'even') return (
                            <div key={index} className='p-8 bg-primary/90 text-white rounded-3xl flex flex-col items-center'>
                                <h2 className="bg-white/96 text-text-primary  w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-h3 sm:text-h2 font-semibold mb-8 shadow-[4px_4px_12px_0px_rgba(240,248,255,0.32)]"> {step.step} </h2>
                                <h1 className="font-bold text-body mb-2 font-heading"> {step.title} </h1>
                                <p className="text-caption"> {step.description} </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
        
          {/* TESTIMONIALS */}
        <section id="testimonial" className="py-12 sm:py-14 lg:py-20 px-4 sm:px-10 lg:px-18 bg-gray-100">
            <div className="max-w-7xl mx-auto text-center space-y-8 sm:space-y-12 md:space-y-16">
                <div className="space-y-3">
                    <h1 className="font-heading text-h3 md:text-h2 font-semibold text-center"> Testimonial </h1>
                    <p className="text-text-secondary text-h2 md:text-h1 font-bold sm:w-1/2 lg:w-1/3 mx-auto">Patients Say About Our Services</p>
                </div>
                
                <div className="overflow-hidden relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <Motion.div 
                        key={current}
                        initial={{ opacity: 0, x:100}}
                        animate={{ opacity:1, x:0}}
                        transition={{duration: 0.6, ease: 'easeInOut'}}
                        exit={{ x: -800, opacity: 0 }}
                        className="flex flex-col items-center max-w-3xl mx-auto"
                    >
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-accent/30 mb-4 overflow-hidden">
                            <img src={testimonials[current].avatar} alt={testimonials[current].name} className="object-cover w-full h-full rounded-full" />
                        </div>
                        <p className="md:text-lg md:leading-8 italic font-medium mb-4 font-heading text-text-secondary"> <q>{testimonials[current].content}</q> </p>
                        <h3 className="md:text-h3 font-semibold font-heading pt-4 border-t-2 border-gray-300 text-primary"> {testimonials[current].name}</h3>
                        <p className="text-small text-text-secondary"> {testimonials[current].role} </p>
                    </Motion.div>
                    
                      {/* CAROUSAL DOTS */}
                    <div className="mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`w-3 h-3 rounded-full mx-1 ${current === index ? 'bg-primary w-5 h-5' : 'bg-text-secondary/60'} transition-all duration-500 ease-in-out`}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        
        <footer className='bg-primary text-white text-center pt-12 sm:pt-14 lg:pt-20 px-4 sm:px-10 lg:px-18'>
            <div className='mb-10 space-y-6'>
                <h1 className='text-body'>Ready to Get Started?</h1>
                <p className='sm:text-h3 text-background'>Join thousands of patients who trust MediCare for their healthcare needs</p>
                <button 
                    onClick={() => {
                        setOpenAuth(true)
                        setFormType('register')
                    }}
                    className="text-small font-semibold py-2 md:py-3 px-4 md:px-8 rounded-xl bg-white text-primary hover:bg-accent-hover hover:text-white hover:shadow-soft transition-all duration-700 ease-in-out cursor-pointer">
                    Get Started
                </button>
            </div>
            
            <div className='py-6 border-t border-white/30'>
                <p className='text-background text-small'>&copy; {Year} MediCare. All rights reserved.</p>
            </div>
        </footer>
        
        {openAuth &&
            <AuthModal 
                openAuth={openAuth}
                setOpenAuth={setOpenAuth}
                formType={formType}
                setFormType={setFormType}
            />
        }
    </div>
  )
}

export default LandingPage;