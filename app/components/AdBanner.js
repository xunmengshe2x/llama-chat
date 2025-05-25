import React from 'react';
import Image from 'next/image';

const AdBanner = () => {
    return (
        <div className="my-4 p-4 rounded-lg bg-gradient-to-r from-amber-100/80 via-amber-200/80 to-amber-100/80 dark:from-amber-900/20 dark:via-amber-800/20 dark:to-amber-900/20 backdrop-blur-sm border border-amber-200/50 dark:border-amber-700/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-amber-300/20 to-amber-400/20 dark:from-amber-400/5 dark:via-amber-300/5 dark:to-amber-400/5 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 relative flex-shrink-0">
                            <Image
                                src="https://poof.new/_next/image?url=%2Fimages%2Flogo-transparent-bg.png&w=640&q=75"
                                alt="Poof.new logo"
                                width={48}
                                height={48}
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200">
                                Build Solana dApps in Minutes
                            </h3>
                            <p className="text-amber-800 dark:text-amber-300 mt-1">
                                Create, deploy, and manage Solana programs without writing a single line of Rust.
                            </p>
                        </div>
                    </div>
                    <a
                        href="https://poof.new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors duration-200 font-medium shadow-sm hover:shadow-md ml-4 flex-shrink-0"
                    >
                        Try Poof.new
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdBanner; 