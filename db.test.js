const db = require('./db')

let uuid = ''

describe('db component test', () => {
    beforeAll(() => {
        // db.cleanDb()
    })
    test('new ing but missing name prop', async () => {
        let newItem = await db.newIngredients()
        delete newItem._id
        delete newItem.uuid
        expect(newItem).toEqual({ err: 'need a name' })
    })
    test('new ing only name', async () => {
        let newItem = await db.newIngredients('123')
        delete newItem._id
        delete newItem.uuid
        expect(newItem).toEqual({ name: '123', unit: 'g', stock: 0 })
    })
    test('new ing with unit', async () => {
        let newItem = await db.newIngredients('1234', 'g')
        delete newItem._id
        delete newItem.uuid
        expect(newItem).toEqual({ name: '1234', unit: 'g', stock: 0 })
    })
    test('new ing with all props', async () => {
        let newItem = await db.newIngredients('12345', 'g', 100)
        uuid = newItem.uuid
        delete newItem._id
        delete newItem.uuid
        expect(newItem).toEqual({ name: '12345', unit: 'g', stock: 100 })
    })
    test('new ing with same name', async () => {
        let newItem = await db.newIngredients('123', 'g', 100)
        delete newItem._id
        delete newItem.uuid
        expect(newItem).toEqual(1)
    })
    test('new ing with same name but not same unit', async () => {
        let newItem = await db.newIngredients('123', 'gg', 100)
        delete newItem._id
        delete newItem.uuid
        expect(newItem).toEqual({ err: 'find a diff unit item' })
    })
    test('list all ing', async () => {
        let allItem = await db.listIngredients()
        expect(allItem.length).toBe(3)
    })
    test('get special ing with uuid', async () => {
        let targetItem = await db.findIngredientsByUUID(uuid)
        delete targetItem._id
        expect(targetItem).toEqual({name:'12345',unit:'g',stock:100,uuid:uuid})
    })
    test('get special ing with uuid but no uuid', async () => {
        let targetItem = await db.findIngredientsByUUID()
        expect(targetItem).toEqual({err: 'need a uuid'})
    })
    test('get special ing with name', async () => {
        let targetItem = await db.findIngredientsByName('12345')
        delete targetItem._id
        expect(targetItem).toEqual({name:'12345',unit:'g',stock:100,uuid:uuid})
    })
    test('get special ing with name but no name', async () => {
        let targetItem = await db.findIngredientsByName()
        expect(targetItem).toEqual({err: 'need a name'})
    })
    test('get special ing with fuzzy name', async () => {
        let targetItem = await db.findIngredientsFuzzy('12345')
        delete targetItem[0]._id
        expect(targetItem[0]).toEqual({name:'12345',unit:'g',stock:100,uuid:uuid})
    })
    test('get special ing with fuzzy name but no name', async () => {
        let targetItem = await db.findIngredientsFuzzy()
        expect(targetItem).toEqual({err: 'need a name'})
    })
    // test('new recipe', async () => { second })
})