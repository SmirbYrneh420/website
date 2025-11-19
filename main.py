from browser import document, html
finale = document["realresult"]
calc = html.TABLE()
calc <= html.TR(html.TH(html.DIV("0", id="result"), colspan=3) + html.TD("C"))
lines = ["789", "456", "123", "0*=", "PXV"]
calc <= (html.TR(html.TD(x) for x in line) for line in lines)
document["pythonboard"] <= calc
result = document["result"]

def collatz(num):
    # Collatz conjecture
    i = 0
    while (num > 1):
        if (num % 2 == 0):
            num /= 2
        else:
            num *= 3
            num += 1 # remove this line for silent mode
        i += 1
        finale <= html.P(str(num))
        if ((num <= 0) or (num % 1 != 0)):
            print("whoops") # if this prints someone give me money

    return i

def pascal(degree):
    # Pascal's Triangle

    triangle = [[1],
                [1,1],
                [1,2,1]]
    if degree < 2:
        return 0

    for i in range(degree - 2):
        new_row = [1]
        for j in range (len(triangle[i+2]) - 1):
            new_row.append(int(triangle[i+2][j]) + int(triangle[i+2][j+1]))
        new_row.append(1)
        triangle.append(new_row)
        
    for item in triangle:
        finale <= html.P(str(item))

    return 0

def pascal_functional(degree):
    # Pascal's Triangle but more useful
    # Triangle
    triangle = [[1],
                [1,1],
                [1,2,1]]
    if degree < 2:
        return 0

    for i in range(degree - 2):
        new_row = [1]
        for j in range (len(triangle[i+2]) - 1):
            new_row.append(int(triangle[i+2][j]) + int(triangle[i+2][j+1]))
        new_row.append(1)
        triangle.append(new_row)
        
    # Prepare for real coefficients (testing in brython rn)
    num = 3
    temp_list = []
    for i in range(len(triangle[-1])):
        temp_list.append(triangle[-1][i]*(num ** i))
    return temp_list

def action(event):
    element = event.target
    value = element.text
    try:
        if value not in "=CPXV":
            if result.text in ["0", "error"]:
                result.text = value
            else:
                result.text = result.text + value
        elif value == "C":
            result.text = "0"
            finale.clear()
        elif value == "P":
            result.text = pascal(int(result.text))
        elif value == "X":
            result.text = pascal_functional(int(result.text))
        elif value == "V":
            result.text == collatz(int(result.text))
    except:
        result.text = "error"

for button in document.select("td"):
    button.bind("click", action)
