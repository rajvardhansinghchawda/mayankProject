import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="bg-background text-on-background min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="ml-64 flex-1 p-8 pt-24 min-h-screen relative z-0">
          {children}
        </main>
      </div>
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-50 pointer-events-none opacity-40">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" id="bg-blob-1"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-secondary-container/10 rounded-full blur-[80px]" id="bg-blob-2"></div>
      </div>
    </div>
  );
};

export default Layout;
