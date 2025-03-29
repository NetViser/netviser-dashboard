type PageTitleFooterProps = {
  fileName: string;
};

export default function PageTitleFooter({ fileName }: PageTitleFooterProps) {
  return (
    <div id="page-title-footer" className="w-full">
      <div className="flex items-center gap-3">
        <span className="text-lg font-medium text-gray-500">Analyzing:</span>
        <span className="px-4 py-2 text-gray-700 bg-white rounded-lg shadow-sm ring-1 ring-gray-200/50">
          {fileName}
        </span>
      </div>
      <div className="w-full mt-6 mb-8 border-b-2 border-gray-200" />
    </div>
  );
}