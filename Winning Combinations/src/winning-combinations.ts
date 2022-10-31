type WinningCombinationsResult = [number, number[]][];

type ObjectType = { [key: string]: number[] };

function call(lines: number[]): WinningCombinationsResult {
  // Aqui é verificado sé a função de checagem se o array é uniforme retornou algo. Caso não, outra logica será trada. Caso sim, o pegamos o retorno dela.
  if (checkTheArrIsUniform(lines)) {
    return checkTheArrIsUniform(lines) as WinningCombinationsResult;
  } else {
    return formattedArray(organizedNumbersEndIndexes(lines));
  }
}

export const WinningCombinations = { call };

// Minha Logica... //

// Esta função verifica se o array passado como parâmetro é uniforme ou seja, se todos os itens nele são exatamente iguais.
function checkTheArrIsUniform(lines: number[]) {
  let getFirstItem = lines[0]; // Está variável salva o primeiro item do array passado no parâmetro.
  let positions: number[] = []; // Este array conterá as posições que o numero inicial se repete.

  // Esta verificação filtra todos os itens que são diferente do primeiro item salvo. Caso o tamanho do array do filtro seja maior que 0, significa que ele não é uniforme.
  // Caso seja, o index referente ao item atual do loop é adicionado no array de posições.
  if (lines.filter((item) => item !== getFirstItem).length === 0) {
    lines.forEach((_, index) => {
      positions.push(index);
    });

    // retornamos um array com outro array dentro com o item que se repete e em seguida outro array com suas posições.
    return [[getFirstItem, [...positions]]] as WinningCombinationsResult;
  }
}

// Esta função organiza como chave qual o numero verificado e um array como value os indexes onde esse numero se repete
function organizedNumbersEndIndexes(lines: number[]) {
  let result = {} as ObjectType;

  lines.forEach((numberActual) => {
    if (numberActual <= 9) {
      // números maiores que 9 serão pulados da verificação
      let positions: number[] = []; // Este array salvará as posições(indexes) onde o numero se repete.

      lines.forEach((line, index) => {
        // Aqui verifica se se chave é a mesmo do item verificado no momento.
        if (numberActual === line) {
          // Aqui é verificado a posição anterior a atual verifica é diferente de -1 e o valor da posição anterior é igual a atual do loop e se a posterior também é igual.
          // Caso seja verdadeiro a posição anterior, a posição atual e a posição posterior a atual serão adicionadas ou array de posições e o loop passa para proxima chave.
          if (
            index - 1 !== -1 &&
            lines[index - 1] === numberActual &&
            lines[index + 1] === numberActual
          ) {
            positions.push(index - 1, index, index + 1);
            return;
          }
          // Aqui é verificado a posição anterior e posição anterior à anterior são diferentes de -1, e se elas são iguais a atual do loop ou se seus valores são iguais a 0.
          // Caso seja verdadeiro a posição anterior e posição anterior à anterior, e a posição atual serão adicionadas ou array de posições e o loop passa para proxima chave.
          if (
            index - 1 !== -1 &&
            index - 2 !== -1 &&
            (lines[index - 1] === numberActual || lines[index - 1] === 0) &&
            (lines[index - 2] === numberActual || lines[index - 2] === 0)
          ) {
            positions.push(index - 2, index - 1, index);
            return;
          }
          // Aqui é verificado a posição posterior e posição posterior à posterior ultrapassa o tamanho do array passado como parâmetro, e se elas são iguais a atual do loop ou se seus valores são iguais a 0.
          // Caso seja verdadeiro a posição atual, posição posterior e a posição posterior à posterior serão adicionadas ou array de posições e o loop passa para proxima chave.
          if (
            index + 1 <= lines.length &&
            index + 2 <= lines.length &&
            (lines[index + 1] === numberActual || lines[index + 1] === 0) &&
            (lines[index + 2] === numberActual || lines[index + 2] === 0)
          ) {
            positions.push(index, index + 1, index + 2);
            return;
          }
        }
      });
      // Caso nenhuma das condições a cima forem verdadeiras não será adicionado nenhum index de posição e o values das chaves verificadas será um array vazio.
      // Aqui é ao final do loop de cada chave é atribuído ao objeto como chave o item atual verificado e como value um array com suas posições onde o item se repete.
      result = { ...result, [numberActual]: positions };
    }
  });

  return result as ObjectType;
}

// Como os zeros também eram eleitos para verificação, tiramos todos seus indexes do seu array de posições e transferimos para outro array.
// Está função transfira todas as posições do value da chave 0 para outra value de outra chave que tenha passado na verificação e que seu tamanho de array não seja '0'
function formattedArray(result: ObjectType) {
  let getZeros: number[] = []; // Cado houver uma chave '0', suas posições serão salva neste array.

  // Verificamos se existe a chave '0'
  if (result["0"]) {
    getZeros = [...result["0"]];
  }

  let newArr: WinningCombinationsResult = []; // Aqui conterá o numero repetido e um array com suas posições.

  // Aqui é verificado a cada chave, se a chave '0' contem posições.
  // Caso verdadeiro, todos as posições da chave '0' é passada para chave atual do loop além de ter seus valores formatados corretamente e sem indexes repetidos.
  // Caso falso, a chave atual apenas terá seu array de posições formatado corretamente e sem indexes repetidos.
  for (let key in result) {
    if (getZeros.length > 0) {
      let addInArr: number[] = [...result[key], ...getZeros];
      if (result[key].length > 0 && key !== "0") {
        newArr.push([Number(...key), [...new Set(addInArr)].sort()]);
      }
    } else {
      let addInArr: number[] = [...result[key]];
      if (result[key].length > 0) {
        newArr.push([Number(...key), [...new Set(addInArr)].sort()]);
      }
    }
  }
  // Aqui conterá a saída final com numero repetido e suas posições ex: entrada = [1,2,0,0,3,1] saída = [[2,[1,2,3]],[3,[2,3,4]]]
  return newArr;
}
