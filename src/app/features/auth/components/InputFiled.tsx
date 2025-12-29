"use client";

type InputFieldProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
};

export default function InputField({
  value,
  onChange,
  placeholder,
  type = "text",
}: InputFieldProps) {
  return (
   <div
  className="
    w-full h-[56px] rounded-[16px] px-5 flex items-center
    bg-white

    border border-black/30
    shadow-[0_4px_14px_rgba(0,0,0,0.08)]
    transition
    focus-within:border-[#FE6E3C]
  "
>
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="
      w-full h-full bg-transparent
      border-0 outline-none shadow-none
      text-[15px] text-[#151415]
      placeholder:text-black/45
    "
  />
</div>

  );
}
