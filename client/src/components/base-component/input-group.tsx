import React from 'react';
import cls from 'classnames';

interface Props {
  className?: string;
  type?: string;
  placeholder?: string;
  value: string;
  error: string | undefined;
  setValue: (arg: string) => void;
}

export const InputGroup: React.FC<Props> = (props) => {
  const {
    className = "mb-2",
    type = "text",
    placeholder = "",
    error,
    value,
    setValue
  } = props;

  return (
    <div className={className}>
      <input className={cls(`w-full p-3 transition duration-200 border border-gray-400 rounded bg-gray-50 focus:bg-white hover:bg-white`,
        { "border-red-500": error }
      )}
        style={{ minWidth: 300 }}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <small className="font-medium text-red-500">{error}</small>
    </div>
  );
};

