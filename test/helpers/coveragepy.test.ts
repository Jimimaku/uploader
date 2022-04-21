import td from 'testdouble'
import childProcess from 'child_process'
import { generateCoveragePyFile } from '../../src/helpers/coveragepy'
import { SPAWNPROCESSBUFFERSIZE } from '../../src/helpers/util'

describe('generateCoveragePyFile()', () => {
    afterEach(() => {
        td.reset()
    })

    it('should run when coveragepy is asked for', async () => {
        const spawnSync = td.replace(childProcess, 'spawnSync')
        td.when(spawnSync('coverage')).thenReturn({
            stdout: 'coverage installed',
            error: null
        })
        td.when(spawnSync('coverage', td.matchers.contains('xml'), { maxBuffer: SPAWNPROCESSBUFFERSIZE })).thenReturn({
            stdout: 'xml',
            error: null
        })

        expect(await generateCoveragePyFile()).toBe('xml')
    })

    it('should return a log when coveragepy is not installed', async () => {
        const spawnSync = td.replace(childProcess, 'spawnSync')
        td.when(spawnSync('coverage')).thenReturn({ error: "command not found: coverage" })

        await expect(generateCoveragePyFile()).rejects.toThrowError(/coveragepy is not installed/)
    })
})
