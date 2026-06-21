export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 py-8 mt-16 text-sm text-gray-500">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} SchemeWise AI. Built to help citizens access government benefits.</p>
        <p>This is an informational assistant. Always verify on the official scheme website before applying.</p>
      </div>
    </footer>
  );
}
