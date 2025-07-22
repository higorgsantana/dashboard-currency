type Option = { label: string; value: string }

type SelectProps = {
    label: string
    value: string
    onChange: (v: string) => void
    options: Option[]
}

export function Select({ label, value, onChange, options }: SelectProps) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        >
          {options.map(({ label, value: val }) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </div>
    )
  }