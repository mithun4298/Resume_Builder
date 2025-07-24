import React, { useState } from 'react';

interface TouchListItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  status?: 'complete' | 'incomplete' | 'draft';
  icon?: React.ReactNode;
}

interface TouchListProps {
  items: TouchListItem[];
  onItemClick?: (item: TouchListItem) => void;
  onItemEdit?: (item: TouchListItem) => void;
  onItemDelete?: (item: TouchListItem) => void;
  onAddNew?: () => void;
  addNewLabel?: string;
  emptyState?: {
    icon: React.ReactNode;
    title: string;
    description: string;
    actionLabel: string;
  };
  allowReorder?: boolean;
  onReorder?: (items: TouchListItem[]) => void;
}

export const TouchList: React.FC<TouchListProps> = ({
  items,
  onItemClick,
  onItemEdit,
  onItemDelete,
  onAddNew,
  addNewLabel = "Add New",
  emptyState,
  allowReorder = false,
  onReorder
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    setDragOverItem(itemId);
  };

  const handleDrop = (e: React.DragEvent, dropItemId: string) => {
    e.preventDefault();
    
    if (!draggedItem || !onReorder) return;

    const draggedIndex = items.findIndex(item => item.id === draggedItem);
    const dropIndex = items.findIndex(item => item.id === dropItemId);

    if (draggedIndex === -1 || dropIndex === -1) return;

    const newItems = [...items];
    const [draggedItemData] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItemData);

    onReorder(newItems);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'incomplete':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'complete':
        return (
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'incomplete':
        return (
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'draft':
        return (
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (items.length === 0 && emptyState) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
          {emptyState.icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {emptyState.title}
        </h3>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          {emptyState.description}
        </p>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {emptyState.actionLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="touch-list space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`bg-white rounded-xl border-2 transition-all duration-200 ${
            dragOverItem === item.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
          } ${draggedItem === item.id ? 'opacity-50' : ''}`}
          draggable={allowReorder}
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDrop={(e) => handleDrop(e, item.id)}
          onDragEnd={() => {
            setDraggedItem(null);
            setDragOverItem(null);
          }}
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              {/* Content */}
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => onItemClick?.(item)}
              >
                <div className="flex items-center space-x-3 mb-2">
                  {/* Drag Handle */}
                  {allowReorder && (
                    <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </div>
                  )}

                  {/* Icon */}
                  {item.icon && (
                    <div className="text-gray-600">
                      {item.icon}
                    </div>
                  )}

                  {/* Title */}
                  <h4 className="font-semibold text-gray-900 flex-1">
                    {item.title}
                  </h4>

                  {/* Status Badge */}
                  {item.status && (
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(item.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Subtitle */}
                {item.subtitle && (
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {item.subtitle}
                  </p>
                )}

                {/* Description */}
                {item.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 ml-4">
                {onItemEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemEdit(item);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                )}

                {onItemDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemDelete(item);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.947A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add New Button */}
      {onAddNew && (
        <button
          onClick={onAddNew}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{addNewLabel}</span>
        </button>
      )}
    </div>
  );
};