function mathjs(hljs) {
  function either(args) {
    return '(' + args.join('|') + ')';
  }

  function keywords(args) {
    return '\\b' + either(args) + '\\b';
  }

  const OPERATORS = {
    scope: 'punctuation',
    begin: /[=+\-*/.^?!%'<>:~]+/,
  };

  const OPERATOR_KEYWORDS = {
    scope: 'punctuation',
    begin: keywords(['to', 'in', 'and', 'not', 'or', 'xor', 'mod']),
  };

  const NUMBER_KEYWORDS = {
    scope: 'number',
    begin: keywords(['true', 'false', 'end']),
  };

  const UNIT_LIST = Object.keys(math.Unit.UNITS)
  const PREFIXED_UNIT_LIST = UNIT_LIST

  for (const prefixType in math.Unit.PREFIXES) {
    for (const prefix in math.Unit.PREFIXES[prefixType]) {
      for (const baseUnit of UNIT_LIST) {
        const unit = prefix + baseUnit
        if (!UNIT_LIST.includes(unit) && math.Unit.isValuelessUnit(unit)) {
          PREFIXED_UNIT_LIST.push(unit)
        }
      }
    }
  }

  const UNITS = {
    scope: 'class',
    begin: keywords(PREFIXED_UNIT_LIST),
  };

  // taken from https://mathjs.org/docs/datatypes/units.html#physical-constants
  const PYSICAL_CONSTANTS = {
    scope: 'class',
    begin: keywords(

      [
        // Universal constants
        'speedOfLight', 'gravitationConstant', 'planckConstant', 'reducedPlanckConstant',

        // Electromagnetic constants
        'magneticConstant', 'electricConstant', 'vacuumImpedance', 'coulomb', 'elementaryCharge', 'bohrMagneton',
        'conductanceQuantum', 'inverseConductanceQuantum', 'magneticFluxQuantum', 'nuclearMagneton', 'klitzing',

        //Atomic and nuclear constants
        'bohrRadius', 'classicalElectronRadius', 'electronMass', 'fermiCoupling', 'fineStructure', 'hartreeEnergy',
        'protonMass', 'deuteronMass', 'neutronMass', 'quantumOfCirculation', 'rydberg', 'thomsonCrossSection',
        'weakMixingAngle', 'efimovFactor',

        //Physico-chemical constants
        'atomicMass', 'avogadro', 'boltzmann', 'faraday', 'firstRadiation', 'loschmidt', 'gasConstant',
        'molarPlanckConstant', 'molarVolume', 'sackurTetrode', 'secondRadiation', 'stefanBoltzmann',
        'wienDisplacement',

        //Adopted Values
        'molarMass', 'molarMassC12', 'gravity', 'atm',

        //Natural Units
        'planckLength', 'planckMass', 'planckTime', 'planckCharge', 'planckTemperature'
      ]
    ),
  }

  const MATRIX = {
    scope: 'bullet',
    begin: /[\[\],;]/,
  };

  const FUNCTION_LIST = Object.keys(math.expression.mathWithTransform)
    .filter(mathFunction => !['expr', 'type'].includes(mathFunction));

  const FUNCTIONS = {
    scope: 'title',
    begin: keywords(FUNCTION_LIST),
  };

  const VARIABLE = {
    scope: 'variable',
    begin: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
  };

  return {
    name: 'mathjs',
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.C_NUMBER_MODE,
      NUMBER_KEYWORDS,
      OPERATORS,
      OPERATOR_KEYWORDS,
      UNITS,
      PYSICAL_CONSTANTS,
      MATRIX,
      FUNCTIONS,
      VARIABLE,
    ],
  };
}

hljs.registerLanguage('mathjs', mathjs);
