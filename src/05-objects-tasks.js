/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function getArea() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const valuesArr = JSON.parse(json);
  function Abstract() {
    Object.keys(valuesArr).forEach((el) => {
      this[el] = valuesArr[el];
    });
  }
  Abstract.prototype = proto;
  const myObj = new Abstract();

  return myObj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssSelector {
  constructor() {
    this.selector = {
      element: '',
      id: '',
      class: '',
      attr: '',
      pseudoClass: '',
      pseudoElement: '',
    };
  }

  checkSelectorExists(selector) {
    if (this.selector[selector]) {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
  }

  checkSelectorOrder(selector) {
    const reversedKeys = [...Object.keys(this.selector).reverse()];

    for (let key = 0; key < reversedKeys.length; key += 1) {
      if (reversedKeys[key] === selector) {
        return;
      }
      if (this.selector[reversedKeys[key]]) {
        throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    }
  }

  element(value) {
    this.checkSelectorExists('element');
    this.checkSelectorOrder('element');
    this.selector.element = value;
    return this;
  }

  id(value) {
    this.checkSelectorExists('id');
    this.checkSelectorOrder('id');
    this.selector.id = `#${value}`;
    return this;
  }

  class(value) {
    this.checkSelectorOrder('class');
    this.selector.class += `.${value}`;
    return this;
  }

  attr(value) {
    this.checkSelectorOrder('attr');
    this.selector.attr += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    this.checkSelectorOrder('pseudoClass');
    this.selector.pseudoClass += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    this.checkSelectorExists('pseudoElement');
    this.checkSelectorOrder('pseudoElement');
    this.selector.pseudoElement = `::${value}`;
    return this;
  }

  stringify() {
    return Object.values(this.selector).join('');
  }
}

const cssSelectorBuilder = {
  selector: '',
  createSelector(selector, value) {
    const builder = new CssSelector();
    builder[selector](value);
    return builder;
  },
  element(value) {
    return this.createSelector('element', value);
  },
  id(value) {
    return this.createSelector('id', value);
  },
  class(value) {
    return this.createSelector('class', value);
  },
  attr(value) {
    return this.createSelector('attr', value);
  },
  pseudoClass(value) {
    return this.createSelector('pseudoClass', value);
  },
  pseudoElement(value) {
    return this.createSelector('pseudoElement', value);
  },
  combine(selector1, combinator, selector2) {
    this.selector = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  },
  stringify() {
    return this.selector;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
