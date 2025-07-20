import { Button } from "@/components/ui/button";
import { Star, FileText, Sparkles, Download, Users, Zap, ShieldCheck, LayoutGrid, Smile, CheckCircle } from "lucide-react";
import ParticleBackground from "@/components/particle-bg";
import AnimatedKeywords from "@/components/animated-keywords";
import { motion } from "framer-motion";
import TemplateCarousel from "@/components/TemplateCarousel";

const features = [
	{
		icon: <Sparkles className="h-7 w-7 text-blue-500" />,
		title: "AI-Powered Content",
		description: "Generate professional summaries and bullet points with AI assistance.",
	},
	{
		icon: <LayoutGrid className="h-7 w-7 text-indigo-500" />,
		title: "Modern Templates",
		description: "Choose from beautiful, ATS-optimized templates.",
	},
	{
		icon: <Download className="h-7 w-7 text-green-500" />,
		title: "1-Click PDF Export",
		description: "Download your resume instantly as a polished PDF.",
	},
	{
		icon: <Users className="h-7 w-7 text-pink-500" />,
		title: "Real-time Preview",
		description: "See your changes live as you edit.",
	},
	{
		icon: <Zap className="h-7 w-7 text-yellow-500" />,
		title: "Lightning Fast",
		description: "Build and export resumes in minutes, not hours.",
	},
	{
		icon: <ShieldCheck className="h-7 w-7 text-teal-500" />,
		title: "Secure & Private",
		description: "Your data is encrypted and never sold.",
	},
	{
		icon: <Smile className="h-7 w-7 text-purple-500" />,
		title: "Easy to Use",
		description: "Intuitive, distraction-free interface for everyone.",
	},
	{
		icon: <CheckCircle className="h-7 w-7 text-orange-500" />,
		title: "Trusted Results",
		description: "Loved by job seekers and recruiters alike.",
	},
];

const logos = [
	{ src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", alt: "Microsoft" },
	{ src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", alt: "Google" },
	{ src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", alt: "Netflix" },
	{ src: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Amazon_logo.svg", alt: "Amazon" },
	{ src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg", alt: "Facebook" },
];

const testimonials = [
	{
		name: "Sarah J.",
		title: "Product Designer",
		quote: "ResumeAI made my job search so much easier. The AI suggestions were spot on and the templates are gorgeous!",
		avatar: "https://randomuser.me/api/portraits/women/44.jpg",
	},
	{
		name: "James L.",
		title: "Software Engineer",
		quote: "I landed 3 interviews in a week after switching to a ResumeAI template. The export is instant and looks amazing.",
		avatar: "https://randomuser.me/api/portraits/men/32.jpg",
	},
	{
		name: "Priya K.",
		title: "Marketing Lead",
		quote: "The live preview and AI-powered content saved me hours. Highly recommend!",
		avatar: "https://randomuser.me/api/portraits/women/68.jpg",
	},
];

export default function Landing() {
	return (
		<div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-x-hidden">
			<ParticleBackground />

			{/* Navbar */}
			<nav className="fixed top-0 left-0 w-full z-30 backdrop-blur-md bg-white/60 border-b border-slate-200/60 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
					<div className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
							<FileText className="h-4 w-4 text-white" />
						</div>
						<span className="text-xl font-bold text-slate-900 tracking-tight">ResumeAI</span>
					</div>
					<div className="hidden md:flex items-center space-x-8 text-slate-700 font-medium">
						<a href="#features" className="hover:text-primary transition-colors">
							Features
						</a>
						<a href="#testimonials" className="hover:text-primary transition-colors">
							Testimonials
						</a>
						<a href="#pricing" className="hover:text-primary transition-colors">
							Pricing
						</a>
					</div>
					<Button
						onClick={() => (window.location.href = "/api/login")}
						className="bg-primary hover:bg-primary/90 px-6 py-2 text-base font-semibold shadow-md"
					>
						Get Started
					</Button>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative flex flex-col items-center justify-center pt-32 pb-24 text-center z-10">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: "easeOut" }}
					className="mb-4"
				>
					<h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 drop-shadow-lg tracking-tight mb-2">
						Your Next Job Starts Here
					</h1>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 24, scale: 0.98 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ delay: 0.18, duration: 0.8, ease: "easeOut" }}
					className="mb-4"
				>
					<div className="inline-block text-2xl md:text-4xl font-extrabold leading-tight">
						<span
							className="block drop-shadow-xl animate-textcolor"
							style={{
								color: "#f43f5e",
								animation: "textcolor-x 3.5s ease-in-out infinite",
								textShadow: "0 4px 24px rgba(80,0,180,0.18), 0 1px 0 #fff",
								filter: "brightness(1.15) contrast(1.15)",
							}}
						>
							Beautiful,{" "}
							<AnimatedKeywords className="inline" words={["Smart"]} /> Resumes in Minutes
						</span>
					</div>
				</motion.div>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.4 }}
					className="text-lg md:text-2xl text-slate-700 mb-10 max-w-2xl mx-auto"
				>
					Build a beautiful, professional resume in minutes with AI-powered guidance and modern design.
				</motion.p>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.5, duration: 0.5 }}
					className="flex flex-col sm:flex-row gap-4 justify-center"
				>
					<Button
						size="lg"
						onClick={() => (window.location.href = "/api/login")}
						className="relative bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-lg px-8 py-3 shadow-xl transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 group"
					>
						Get Started Free
						<span className="inline-block ml-3 align-middle">
							<motion.svg
								width="28"
								height="28"
								viewBox="0 0 28 28"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="inline-block align-middle"
								initial={{ x: 0 }}
								animate={{ x: [0, 8, 0] }}
								transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
							>
								<path
									d="M7 14h14m0 0l-5-5m5 5l-5 5"
									stroke="currentColor"
									strokeWidth="2.2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</motion.svg>
						</span>
					</Button>
				</motion.div>
				{/* Animated floating shapes */}
				<div className="absolute left-0 right-0 top-0 pointer-events-none z-0">
					<svg
						className="mx-auto"
						width="100%"
						height="120"
						viewBox="0 0 1440 120"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill="url(#paint0_linear)"
							fillOpacity="0.2"
							d="M0,64L48,74.7C96,85,192,107,288,117.3C384,128,480,128,576,112C672,96,768,64,864,69.3C960,75,1056,117,1152,133.3C1248,149,1344,139,1392,133.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
						/>
						<defs>
							<linearGradient
								id="paint0_linear"
								x1="0"
								y1="0"
								x2="1440"
								y2="0"
								gradientUnits="userSpaceOnUse"
							>
								<stop stopColor="#6366f1" />
								<stop offset="1" stopColor="#3b82f6" />
							</linearGradient>
						</defs>
					</svg>
				</div>
			</section>

			{/* Trusted By Logos */}
			<motion.section
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.7 }}
				className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center"
			>
				<div className="text-slate-500 text-sm mb-2">Trusted by professionals at</div>
				<div className="flex flex-wrap justify-center gap-8 items-center">
					{logos.map((logo, i) => (
						<motion.img
							key={logo.alt}
							src={logo.src}
							alt={logo.alt}
							className="h-8 md:h-10 grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.1, duration: 0.5 }}
						/>
					))}
				</div>
			</motion.section>

			{/* Template Carousel */}
			<div className="w-full flex justify-center mb-10">
				<div className="max-w-4xl w-full">
					<TemplateCarousel />
				</div>
			</div>
			{/* End Template Carousel */}

			{/* Features Grid */}
			<section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
				<h2 className="text-3xl font-bold text-center mb-10">Features</h2>
				<div className="grid md:grid-cols-4 gap-8">
					{features.map((feature, i) => (
						<motion.div
							key={feature.title}
							className="bg-white/80 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-slate-100 hover:shadow-2xl transition-all"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.08, duration: 0.5 }}
						>
							<div className="mb-4">{feature.icon}</div>
							<div className="font-semibold text-lg mb-2">{feature.title}</div>
							<div className="text-slate-600">{feature.description}</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* Testimonials Section */}
			<section id="testimonials" className="max-w-7xl mx-auto px-4 py-24">
				<h2 className="text-3xl font-bold text-center mb-8">Testimonials</h2>
				<div className="grid md:grid-cols-3 gap-6">
					{testimonials.map((t, i) => (
						<motion.div
							key={t.name}
							className="rounded-2xl bg-white/90 shadow-xl p-8 flex flex-col items-center text-center border border-slate-100 hover:shadow-2xl transition-all"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.12, duration: 0.5 }}
						>
							<img
								src={t.avatar}
								alt={t.name}
								className="w-16 h-16 rounded-full mb-4 shadow-md object-cover"
							/>
							<div className="text-lg font-semibold text-slate-900 mb-1">{t.name}</div>
							<div className="text-primary text-sm mb-2">{t.title}</div>
							<div className="text-slate-600 text-base mb-2">“{t.quote}”</div>
							<div className="flex justify-center gap-1 mt-2">
								{[...Array(5)].map((_, idx) => (
									<Star key={idx} className="w-4 h-4 text-yellow-400 fill-yellow-300" />
								))}
							</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-24 px-4">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.7 }}
					className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto text-center text-white relative overflow-hidden"
				>
					<h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
						Ready to Create Your Resume?
					</h2>
					<p className="mb-8 text-lg md:text-xl opacity-90">
						Join thousands of job seekers who have landed their dream jobs with ResumeAI.
					</p>
					<Button
						size="lg"
						onClick={() => (window.location.href = "/api/login")}
						className="bg-white text-primary font-bold text-lg px-8 py-3 shadow-lg hover:bg-slate-100 hover:scale-105 transition-transform"
					>
						Get Started for Free
					</Button>
					{/* Parallax/floating shapes */}
					<div className="absolute -top-10 -right-10 opacity-30 pointer-events-none">
						<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
							<circle cx="60" cy="60" r="60" fill="#fff" />
						</svg>
					</div>
					<div className="absolute -bottom-10 -left-10 opacity-20 pointer-events-none">
						<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
							<rect width="120" height="120" rx="60" fill="#fff" />
						</svg>
					</div>
				</motion.div>
			</section>
		</div>
	);
}
