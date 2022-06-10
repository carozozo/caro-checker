describe(__filename, () => {
  describe(`object().size([limit = 1]) - 檢查長度`, async () => {
    cc.object.postRule.size = (helper, limit) => {
      const input = helper.getInput()

      limit = helper.extractRef(limit) || 1

      if (Object.keys(input).length === limit) return
      helper.markError(`{#label} size should be ${limit}`)
    }

    describe(`object().size()`, async () => {
      const errMsg = `the input size should be 1`

      it(`通過: {a: 1}`, async () => {
        const input = {a: 1}
        const info = await cc.object().size().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: 1, b: 2}`, async () => {
        const input = {a: 1, b: 2}
        const info = await cc.object().size().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`object().size(3)`, async () => {
      const size = 3

      it(`通過: {a: 1, b: 2, c: 3}`, async () => {
        const input = {a: 1, b: 2, c: 3}
        const info = await cc.object().size(size).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: 1, b: 2}`, async () => {
        const input = {a: 1, b: 2}
        const info = await cc.object().size(size).parse(input)
        assert.strictEqual(info.error, `the input size should be ${size}`)
      })
    })

    describe(`{size: cc.number().required(), obj: cc.object().size(cc.ref('size')).required()}`, async () => {
      const size = 3
      const errMsg = `obj size should be ${size}`

      const plan = {
        size: cc.number().required(),
        obj: cc.object().size(cc.ref('size')).required(),
      }

      it(`通過: {size, obj: {a: 1, b: 2, c: 3}}`, async () => {
        const input = {size, obj: {a: 1, b: 2, c: 3}}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {size, obj: {a: 1, b: 2, c: 3, d: 4}}`, async () => {
        const input = {size, obj: {a: 1, b: 2, c: 3, d: 4}}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`object().min([limit = 1]) - 檢查最小長度`, async () => {
    cc.object.postRule.min = (helper, limit) => {
      const input = helper.getInput()

      limit = helper.extractRef(limit) || 1

      if (Object.keys(input).length >= limit) return
      helper.markError(`{#label} size cannot be less than ${limit}`)
    }

    describe(`object().min()`, async () => {
      const errMsg = `the input size cannot be less than 1`

      it(`通過: {a: 1, b: 2, c: 3}`, async () => {
        const input = {a: 1, b: 2, c: 3}
        const info = await cc.object().min().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {}`, async () => {
        const input = {}
        const info = await cc.object().min().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`object().min(3)`, async () => {
      const limit = 3
      const errMsg = `the input size cannot be less than ${limit}`

      it(`通過: {a: 1, b: 2, c: 3}`, async () => {
        const input = {a: 1, b: 2, c: 3}
        const info = await cc.object().min(limit).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: {a: 1, b: 2, c: 3, d: 4}`, async () => {
        const input = {a: 1, b: 2, c: 3, d: 4}
        const info = await cc.object().min(limit).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: 1, b: 2}`, async () => {
        const input = {a: 1, b: 2}
        const info = await cc.object().min(limit).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`{min: cc.number().required(), obj: cc.object().min(cc.ref('min')).required()}`, async () => {
      const min = 3
      const errMsg = `obj size cannot be less than ${min}`

      const plan = {
        min: cc.number().required(),
        obj: cc.object().min(cc.ref('min')).required(),
      }

      it(`通過: {size, obj: {a: 1, b: 2, c: 3}}`, async () => {
        const input = {min, obj: {a: 1, b: 2, c: 3}}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {size, obj: {a: 1}}`, async () => {
        const input = {min, obj: {a: 1}}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`object().max([limit = 1]) - 檢查最大長度`, async () => {
    cc.object.postRule.max = (helper, limit) => {
      const input = helper.getInput()

      limit = helper.extractRef(limit) || 1

      if (Object.keys(input).length <= limit) return
      helper.markError(`{#label} size cannot be greater than ${limit}`)
    }

    describe(`object().max()`, async () => {
      const errMsg = `the input size cannot be greater than 1`

      it(`通過: {a: 1}`, async () => {
        const input = {a: 1}
        const info = await cc.object().max().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: 1, b: 2}`, async () => {
        const input = {a: 1, b: 2}
        const info = await cc.object().max().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`object().max(3)`, async () => {
      const limit = 3
      const errMsg = `the input size cannot be greater than ${limit}`

      it(`通過: {a: 1, b: 2, c: 3}`, async () => {
        const input = {a: 1, b: 2, c: 3}
        const info = await cc.object().max(limit).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: 1, b: 2, c: 3, d: 4}`, async () => {
        const input = {a: 1, b: 2, c: 3, d: 4}
        const info = await cc.object().max(limit).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`{max: cc.number().required(), obj: cc.object().max(cc.ref('max')).required()}`, async () => {
      const max = 3
      const errMsg = `obj size cannot be greater than ${max}`

      const plan = {
        max: cc.number().required(),
        obj: cc.object().max(cc.ref('max')).required(),
      }

      it(`通過: {size, obj: {a: 1, b: 2, c: 3}`, async () => {
        const input = {max, obj: {a: 1, b: 2, c: 3}}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {size, obj: {a: 1, b: 2, c: 3, d: 4}}`, async () => {
        const input = {max, obj: {a: 1, b: 2, c: 3, d: 4}}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`object().together(setting = {fields = [], warning}, [...setting]) - 指定欄位需同時有值或無值`, async () => {
    cc.object.postRule.together = (helper, ...settings) => {
      const input = helper.getInput()

      for (let {fields, warning} of settings) {
        const checkUndefined = input[fields[0]] === undefined

        helper.note(`${fields.join(',')}`)

        let errField = ''
        for (const field of fields) {
          const isUndefined = input[field] === undefined
          if (checkUndefined && isUndefined) continue
          if (!checkUndefined && !isUndefined) continue
          errField = field
        }

        if (!errField) continue

        if (!warning) warning = `${fields.join(', ')} should come together`

        helper.markError(warning)
        break
      }
    }

    describe(`object().together({fields: ['a', 'b']})`, async () => {
      const setting = {fields: ['a', 'b']}

      it(`通過: {a: true, b: true}`, async () => {
        const input = {a: true, b: true}
        const info = await cc.object().together(setting).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: {a: undefined, b: undefined}`, async () => {
        const input = {a: undefined, b: undefined}
        const info = await cc.object().together(setting).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: true, b: undefined}`, async () => {
        const input = {a: true, b: undefined}
        const info = await cc.object().together(setting).parse(input)
        assert.strictEqual(info.note, `a,b`)
        assert.strictEqual(info.error, `a, b should come together`)
      })
      it(`不通過: {a: undefined, b: true}`, async () => {
        const input = {a: undefined, b: true}
        const info = await cc.object().together(setting).parse(input)
        assert.strictEqual(info.note, `a,b`)
        assert.strictEqual(info.error, `a, b should come together`)
      })
    })

    describe(`object().together({fields: ['a', 'b']}, {fields: ['c', 'd']})`, async () => {
      const setting = {fields: ['a', 'b']}
      const setting2 = {fields: ['c', 'd']}

      it(`通過: {a: true, b: true, c: true, d: true}`, async () => {
        const input = {a: true, b: true, c: true, d: true}
        const info = await cc.object().together(setting, setting2).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: {a: true, b: true, c: undefined, d: undefined}`, async () => {
        const input = {a: true, b: true, c: undefined, d: undefined}
        const info = await cc.object().together(setting, setting2).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: true, b: true, c: true, d: undefined}`, async () => {
        const input = {a: true, b: true, c: true, d: undefined}
        const info = await cc.object().together(setting, setting2).parse(input)
        assert.strictEqual(info.note, `c,d`)
        assert.strictEqual(info.error, `c, d should come together`)
      })
      it(`不通過: {a: true, b: true, c: undefined, d: true}`, async () => {
        const input = {a: true, b: true, c: undefined, d: true}
        const info = await cc.object().together(setting, setting2).parse(input)
        assert.strictEqual(info.note, `c,d`)
        assert.strictEqual(info.error, `c, d should come together`)
      })
    })
  })

  describe(`object().scoop(setting = {fields = [], min = 1, max = 1, warning}, [...setting]) - 指定欄位中有幾個需有值`, async () => {
    cc.object.postRule.scoop = (helper, ...settings) => {
      for (let {fields, min = 1, max = min, warning} of settings) {
        const amount = fields.length
        let count = 0

        min = helper.extractRef(min) || 1
        max = helper.extractRef(max) || 1

        // 自動調整上下限
        if (min < 1) min = 1
        if (max < 1) max = 1
        if (min > amount) min = amount
        if (max > amount) max = amount
        if (max < min) max = min

        helper.note(fields.join(','))

        for (const field of fields) {
          if (helper.getInput()[field] !== undefined) count++
        }

        if (count >= min && count <= max) continue

        if (!warning) {
          const beVerb = min === max && min === 1 ? `is` : `are`
          const range = min === max ? `${min}` : `${min}~${max}`
          const among = amount > 2 ? `among` : `between`
          warning = `there ${beVerb} ${range} required ${among} ${fields.join(', ')}`
        }

        helper.markError(warning)
        break
      }
    }

    describe(`object().scoop({fields: ['a', 'b', 'c']})`, async () => {
      const setting = {fields: ['a', 'b', 'c']}

      it(`通過: {a: true, b: undefined, c: undefined}`, async () => {
        const input = {a: true, b: undefined, c: undefined}
        const info = await cc.object().scoop(setting).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: true, b: true, c: undefined}`, async () => {
        const input = {a: true, b: true, c: undefined}
        const info = await cc.object().scoop(setting).parse(input)
        assert.strictEqual(info.note, `a,b,c`)
        assert.strictEqual(info.error, `there is 1 required among a, b, c`)
      })
    })

    describe(`object().scoop({fields: ['a', 'b', 'c'], min: 2})`, async () => {
      const setting = {fields: ['a', 'b', 'c'], min: 2}

      it(`通過: {a: true, b: true, c: undefined}`, async () => {
        const input = {a: true, b: true, c: undefined}
        const info = await cc.object().scoop(setting).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: true, b: undefined, c: undefined}`, async () => {
        const input = {a: true, b: undefined, c: undefined}
        const info = await cc.object().scoop(setting).parse(input)
        assert.strictEqual(info.note, `a,b,c`)
        assert.strictEqual(info.error, `there are 2 required among a, b, c`)
      })
    })

    describe(`object().scoop({fields: ['a', 'b', 'c'], min: 2, max: 3})`, async () => {
      const setting = {fields: ['a', 'b', 'c'], min: 2, max: 3}

      it(`通過: {a: true, b: true, c: undefined}`, async () => {
        const input = {a: true, b: true, c: undefined}
        const info = await cc.object().scoop(setting).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: true, b: undefined, c: undefined}`, async () => {
        const input = {a: true, b: undefined, c: undefined}
        const info = await cc.object().scoop(setting).parse(input)
        assert.strictEqual(info.note, `a,b,c`)
        assert.strictEqual(info.error, `there are 2~3 required among a, b, c`)
      })
    })

    describe(`object().scoop({fields: ['a', 'b', 'c']}, {fields: ['d', 'e']})`, async () => {
      const setting = {fields: ['a', 'b', 'c']}
      const setting2 = {fields: ['d', 'e']}

      it(`通過: {a: true, b: undefined, c: undefined, d: true, e: undefined}`, async () => {
        const input = {a: true, b: undefined, c: undefined, d: true, e: undefined}
        const info = await cc.object().scoop(setting, setting2).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: true, b: undefined, c: undefined, d: true, e: true}`, async () => {
        const input = {a: true, b: undefined, c: undefined, d: true, e: true}
        const info = await cc.object().scoop(setting, setting2).parse(input)
        assert.strictEqual(info.note, `d,e`)
        assert.strictEqual(info.error, `there is 1 required between d, e`)
      })
    })
  })
})

