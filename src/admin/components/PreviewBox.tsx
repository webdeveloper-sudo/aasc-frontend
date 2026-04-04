import React from "react";

interface PreviewBoxProps {
  entity: string;
  data: any;
}

const PreviewBox: React.FC<PreviewBoxProps> = ({ entity, data }) => {
  if (!data) return null;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm sticky top-6">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 font-semibold text-sm text-gray-700 flex justify-between items-center">
        <span>Live Preview</span>
        <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded capitalize">
          {entity}
        </span>
      </div>
      <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Generic JSON Preview for now */}
        <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>

        {/* TODO: Implement specific component previews based on entity */}
        {/* Example:
        {entity === 'events' && <EventCard event={data} />}
        */}
      </div>
    </div>
  );
};

export default PreviewBox;
