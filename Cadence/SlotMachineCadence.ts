type AnticipatorConfig = {
  columnSize: number;
  minToAnticipate: number;
  maxToAnticipate: number;
  anticipateCadence: number;
  defaultCadence: number;
};

type SlotCoordinate = {
  column: number;
  row: number;
};

type SpecialSymbol = { specialSymbols: Array<SlotCoordinate> };

type RoundsSymbols = {
  roundOne: SpecialSymbol;
  roundTwo: SpecialSymbol;
  roundThree: SpecialSymbol;
};

type SlotCadence = Array<number>;

type RoundsCadences = {
  roundOne: SlotCadence;
  roundTwo: SlotCadence;
  roundThree: SlotCadence;
};

/**
 * Anticipator configuration. Has all information needed to check anticipator.
 * @param columnSize It's the number of columns the slot machine has.
 * @param minToAnticipate It's the minimum number of symbols to start anticipation.
 * @param maxToAnticipate It's the maximum number of symbols to end anticipation.
 * @param anticipateCadence It's the cadence value when has anticipation.
 * @param defaultCadence It's the cadence value when don't has anticipation.
 */
const anticipatorConfig: AnticipatorConfig = {
  columnSize: 5,
  minToAnticipate: 2,
  maxToAnticipate: 3,
  anticipateCadence: 2,
  defaultCadence: 0.25,
};

/**
 * Game rounds with special symbols position that must be used to generate the SlotCadences.
 */
const gameRounds: RoundsSymbols = {
  roundOne: {
    specialSymbols: [
      { column: 0, row: 2 },
      { column: 1, row: 3 },
      { column: 3, row: 4 },
    ],
  },
  roundTwo: {
    specialSymbols: [
      { column: 0, row: 2 },
      { column: 0, row: 3 },
    ],
  },
  roundThree: {
    specialSymbols: [
      { column: 4, row: 2 },
      { column: 4, row: 3 },
    ],
  },
};

/**
 * This must be used to get all game rounds cadences.
 */
const slotMachineCadences: RoundsCadences = {
  roundOne: [],
  roundTwo: [],
  roundThree: [],
};

/**
 * This function receives an array of coordinates relative to positions in the slot machine's matrix.
 * This array is the positions of the special symbols.
 * And it has to return a slot machine stop cadence.
 * @param symbols Array<SlotCoordinate> positions of the special symbols. Example: [{ column: 0, row: 2 }, { column: 2, row: 3 }]
 * @returns SlotCadence Array of numbers representing the slot machine stop cadence.
 */
function slotCadence(symbols: any) {
  let formatMatriz: { [x: string]: number[] } = {}; // Este objeto irá conter as colunas como key e value array com Zeros dentro contando como se fosse as rows.

  // loop pegando a configuração de colunas da variável 'anticipatorConfig.columnSize'.
  for (let columns = 0; columns < anticipatorConfig.columnSize; columns++) {
    formatMatriz[columns] = []; // cAqui é adicionado uma chave para o objeto 'formatMatriz' e de valor um array vazio, que será preenchido posteriormente.

    // Este loop preenche a value(linhas) de cada chave do objeto 'formatMatriz'
    for (let i = 1; i <= 6; i++) {
      formatMatriz[columns].push(0);
    }
  }

  symbols.forEach((symbol: { column: number; row: number }) => {
    // loop no parâmetro 'symbols' onde no objeto 'formatMatriz' a coluna e a linha dada como coordenadas serão preenchidas como um symbol('*')
    formatMatriz[symbol.column][symbol.row] = 1;
  });

  let linesIncrease: number[] = [] as number[]; // Esta variável irar conter todas as colunas onde a cadencia será alterada.
  let accumulator = 0; // O acumulador que dará a possibilidade de verificar se a quantidade de símbolos é igual ao valor mínimo para iniciar a antecipação.

  for (let index = 0; index < anticipatorConfig.columnSize; index++) {
    // Este loop passa por cada coluna e verifica suas linhas.
    // Caso o simbolo especial seja encontrado na linha verificada a contagem do acumulador é aumentada.
    formatMatriz[index].forEach((rowOfColumn) => {
      if (rowOfColumn === 1) {
        accumulator++;
      }
    });

    // Caso o acumulador seja igual ao valor mínimo para começar uma antecipação e menor que o máximo ele adicionará o próximos dois indexes posteriores
    if (
      accumulator === anticipatorConfig.minToAnticipate &&
      accumulator < anticipatorConfig.maxToAnticipate
    ) {
      if (
        index + 1 < anticipatorConfig.columnSize &&
        index + 2 < anticipatorConfig.columnSize
      ) {
        linesIncrease.push(index + 1, index + 2);
      } else {
        linesIncrease.push(index + 1);
      }
    }
  }

  // Array onde irá conter o resultado com a cadencia de cada rodada.
  let arrOfOutput: number[] = [];

  // Este loop passa por todas as colunas no o objeto e verifica se no array onde tem as colunas que precisa ter a cadencia alteras é a mesma que está sendo verificada
  // Caso a verificação der positivo, pegamos o valor da cadencia da coluna anterior e somamos com a cadencia de antecipação.
  for (let columnActual in formatMatriz) {
    let covertInNumber = Number(columnActual);

    if (covertInNumber === 0) {
      arrOfOutput.push(0);
    } else {
      if (
        linesIncrease.includes(covertInNumber) &&
        covertInNumber < anticipatorConfig.columnSize
      ) {
        arrOfOutput.push(
          arrOfOutput[covertInNumber - 1] + anticipatorConfig.anticipateCadence
        );
      } else {
        arrOfOutput.push(
          arrOfOutput[covertInNumber - 1] + anticipatorConfig.defaultCadence
        );
      }
    }
  }

  // Magic
  return [...arrOfOutput] as number[];
}

/**
 * Get all game rounds and return the final cadences of each.
 * @param rounds RoundsSymbols with contains all rounds special symbols positions.
 * @return RoundsCadences has all cadences for each game round.
 */
function handleCadences(rounds: RoundsSymbols): RoundsCadences {
  slotMachineCadences.roundOne = slotCadence(rounds.roundOne.specialSymbols);
  slotMachineCadences.roundTwo = slotCadence(rounds.roundTwo.specialSymbols);
  slotMachineCadences.roundThree = slotCadence(
    rounds.roundThree.specialSymbols
  );

  return slotMachineCadences;
}

console.log("CADENCES: ", handleCadences(gameRounds));
