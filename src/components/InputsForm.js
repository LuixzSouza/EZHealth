export function InputsForm({label, input}) {
    return(
        <div className="w-full" >
            <label className="text-white text-3xl font-light" >{label}</label>
            <input className="w-full bg-transparent border-b-2 border-white" type={input} ></input>
        </div>
    )
}