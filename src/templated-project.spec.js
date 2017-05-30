import { expect } from 'cafeteria';
import TemplatedProject from './templated-project';

describe('Templated Project', () => {
    it('should be empty when passed an empty project', () => {
        const templProject = new TemplatedProject({});
        expect(templProject.copyableTemplates).to.be.empty();
    });
});
