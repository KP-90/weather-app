const stateCodes = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 
                    'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 
                    'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 
                    'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 
                    'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 
                    'WA', 'WV', 'WI', 'WY' ];

export function createDropDown(stateCodes) {
    let start = document.createElement("select")
    for (let i = 0; i < stateCodes.length; i++) {
        let option = document.createElement("option")
        option.innerText = stateCodes[i]
        option.id = stateCodes[i]
        option.value = stateCodes[i]
        start.appendChild(option)
    }
    return start;
}

export function createForm() {
    let div = document.createElement("div")
    let cityInput = document.createElement("input");
    cityInput.type = 'text'
    let states = createDropDown();
    let btn = document.createElement("button")
    btn.innerText = "Submit"
    div.append(cityInput, states, btn);
    return div
}