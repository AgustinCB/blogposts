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
    sounds: Vec<SoundDevice>,
    buttons: Vec<ButtonDevice>,
}

impl Console {
    fn new() -> Console {
        let mut cpu = Cpu {
            inputs: Vec::new(),
            outputs: Vec::new(),
        };
        let sound1 = Rc::new(SoundDevice {});
        let sound2 = Rc::new(SoundDevice {});
        let sounds = vec![sound1, sound2];
        cpu.inputs.push(sound1);
        cpu.inputs.push(sound2);
        let button1 = Rc::new(ButtonDevice {});
        let button2 = Rc::new(ButtonDevice {});
        let buttons = vec![button1, button2];
        cpu.inputs.push(button1);
        cpu.inputs.push(button2);
        Console {
            cpu,
            sounds,
            buttons,
        }
    }
}
