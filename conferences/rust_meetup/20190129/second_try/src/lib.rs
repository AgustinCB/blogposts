use std::rc::Rc;

trait InputDevice {}
trait OutputDevice {}

struct ButtonDevice {}
impl InputDevice for ButtonDevice {}

struct SoundDevice {}
impl OutputDevice for SoundDevice {}


struct Cpu {
    pub inputs: Vec<Rc<InputDevice>>,
    pub outputs: Vec<Rc<OutputDevice>>,
}

struct Console {
    cpu: Cpu,
    sounds: Vec<Rc<SoundDevice>>,
    buttons: Vec<Rc<ButtonDevice>>,
}

impl Console {
    fn new() -> Console {
        let mut cpu = Cpu {
            inputs: Vec::new(),
            outputs: Vec::new(),
        };
        let sound1 = Rc::new(SoundDevice {});
        let sound2 = Rc::new(SoundDevice {});
        let sounds = vec![sound1.clone(), sound2.clone()];
        cpu.outputs.push(sound1.clone());
        cpu.outputs.push(sound2.clone());
        let button1 = Rc::new(ButtonDevice {});
        let button2 = Rc::new(ButtonDevice {});
        let buttons = vec![button1.clone(), button2.clone()];
        cpu.inputs.push(button1.clone());
        cpu.inputs.push(button2.clone());
        Console {
            cpu,
            sounds,
            buttons,
        }
    }
}
