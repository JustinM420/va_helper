// components/FooterNav.tsx
export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-4 mt-auto w-full">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 VACAx. All rights reserved.</p>
          <div className="mt-2">
            <a href="#" className="text-gray-400 hover:text-white mx-2">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white mx-2">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white mx-2">Contact</a>
          </div>
        </div>
      </footer>
    );
  }
  