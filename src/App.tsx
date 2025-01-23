import { Moon, Play, RotateCcw, Square, Sun } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

interface TimeInputModalProps {
	isOpen: boolean;
	onClose: (hours?: number, minutes?: number) => void;
}

const presetTimes = [
	{ hours: 4, minutes: 0, label: "4:00" },
	{ hours: 5, minutes: 0, label: "5:00" },
	{ hours: 9, minutes: 30, label: "9:30" },
	{ hours: 10, minutes: 0, label: "10:00" },
];

function TimeInputModal({ isOpen, onClose }: TimeInputModalProps) {
	const [hours, setHours] = useState("0");
	const [minutes, setMinutes] = useState("0");

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-96 shadow-2xl">
				<h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
					Set Timer
				</h2>

				<div className="space-y-4">
					<div className="flex gap-4">
						<div className="flex-1">
							<label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
								Hours
							</label>
							<input
								type="number"
								min="0"
								max="23"
								value={hours}
								onChange={(e) => setHours(e.target.value)}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							/>
						</div>
						<div className="flex-1">
							<label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
								Minutes
							</label>
							<input
								type="number"
								min="0"
								max="59"
								value={minutes}
								onChange={(e) => setMinutes(e.target.value)}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2">
						{presetTimes.map((preset) => (
							<button
								key={preset.label}
								onClick={() => onClose(preset.hours, preset.minutes)}
								className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-white"
							>
								{preset.label}
							</button>
						))}
					</div>

					<div className="flex gap-2 mt-6">
						<button
							onClick={() =>
								onClose(Number.parseInt(hours), Number.parseInt(minutes))
							}
							className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
						>
							Set Timer
						</button>
						<button
							onClick={() => onClose()}
							className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

const Terminal = ({ onClose }: { onClose: () => void }) => {
	return (
		<div
			className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 
						 animate-in fade-in duration-300 slide-in-from-bottom-4 cursor-pointer"
			onClick={onClose}
		>
			<div
				className="w-full h-full bg-black/80 font-mono text-green-500 overflow-hidden p-8
						animate-in zoom-in-95 duration-300"
			>
				<div className="animate-typing">
					<p>$ initiating timer sequence...</p>
					<p className="mt-2">$ loading system components...</p>
					<p className="mt-2">$ calibrating time measurements...</p>
					<p className="mt-2">$ establishing notification protocols...</p>
					<p className="mt-2">$ timer active_</p>
					<p className="mt-4 text-xs text-gray-500">Click anywhere to close</p>
				</div>
			</div>
		</div>
	);
};

function App() {
	const [darkMode, setDarkMode] = useState(true);
	const [showModal, setShowModal] = useState(true);
	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [totalSeconds, setTotalSeconds] = useState(0);
	const [showTerminal, setShowTerminal] = useState(false);

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [darkMode]);

	useEffect(() => {
		let interval: number;

		if (isRunning && totalSeconds > 0) {
			interval = setInterval(() => {
				setTotalSeconds((prev) => {
					if (prev <= 1) {
						setIsRunning(false);
						showNotification();
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		return () => clearInterval(interval);
	}, [isRunning, totalSeconds]);

	useEffect(() => {
		setTotalSeconds(hours * 3600 + minutes * 60 + seconds);
	}, [hours, minutes, seconds]);

	const handleTimeSet = (newHours?: number, newMinutes?: number) => {
		if (newHours !== undefined && newMinutes !== undefined) {
			setHours(newHours);
			setMinutes(newMinutes);
			setSeconds(0);
		}
		setShowModal(false);
	};

	const formatTime = (totalSecs: number) => {
		const h = Math.floor(totalSecs / 3600);
		const m = Math.floor((totalSecs % 3600) / 60);
		const s = totalSecs % 60;
		return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
	};

	const showNotification = () => {
		if ("Notification" in window) {
			Notification.requestPermission().then((permission) => {
				if (permission === "granted") {
					new Notification("Timer Complete!", {
						body: "Your timer has finished.",
					});
				}
			});
		}
	};

	const handleContainerClick = (e: React.MouseEvent) => {
		if (isRunning && e.target === e.currentTarget) {
			setShowTerminal(true);
		}
	};

	return (
		<div
			className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}
		>
			<button
				onClick={() => setDarkMode(!darkMode)}
				className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
			>
				{darkMode ? (
					<Sun className="w-6 h-6 text-yellow-500" />
				) : (
					<Moon className="w-6 h-6 text-gray-600" />
				)}
			</button>

			<div
				className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen"
				onClick={handleContainerClick}
			>
				<div
					onClick={(e) => {
						e.stopPropagation();
						setShowModal(true);
					}}
					className="text-8xl font-bold mb-12 cursor-pointer text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
				>
					{formatTime(totalSeconds)}
				</div>

				<div className="flex gap-4">
					{!isRunning ? (
						<button
							onClick={() => {
								setIsRunning(true);
								setShowTerminal(true);
							}}
							className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
						>
							<Play className="w-5 h-5" /> Start
						</button>
					) : (
						<button
							onClick={() => setIsRunning(false)}
							className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
						>
							<Square className="w-5 h-5" /> Stop
						</button>
					)}
					<button
						onClick={() => {
							setIsRunning(false);
							setTotalSeconds(hours * 3600 + minutes * 60);
						}}
						className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
					>
						<RotateCcw className="w-5 h-5" /> Reset
					</button>
				</div>
			</div>

			{showTerminal && <Terminal onClose={() => setShowTerminal(false)} />}
			<TimeInputModal isOpen={showModal} onClose={handleTimeSet} />
		</div>
	);
}

export default App;
