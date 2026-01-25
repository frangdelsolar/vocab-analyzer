// src/components/shared/Container.jsx

export const PageContainer = ({ title, icon, actions, children }) => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    {icon && (
                        <div className="p-3 bg-china-red text-white rounded-xl shadow-china-red/20 shadow-lg dark:bg-china-red dark:shadow-none">
                            {icon}
                        </div>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {title}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            當代中文課程 Contemporary Chinese
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">{actions}</div>
            </div>
            {children}
        </div>
    );
};
